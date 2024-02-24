"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../db/database"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth_middleware"));
const jwt_util_1 = require("../utils/jwt_util");
const multer_middleware_1 = require("../middlewares/multer_middleware");
const router = (0, express_1.Router)();
// Route to retrieve all comments related to a specific post_id
router.get('/post/:post_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = parseInt(req.params.post_id);
        // Retrieve all comments for the specified post_id
        const comments = yield (0, database_1.default)('SELECT * FROM post_comments WHERE post_id = $1', [postId]);
        return res.status(200).json(comments.rows);
    }
    catch (error) {
        console.error('Error while retrieving comments:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to create or update a comment on a post
router.post('/post/:post_id', auth_middleware_1.default, multer_middleware_1.upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the access token from cookies
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        // Verify the access token
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        // If the token is invalid or expired, return an unauthorized response
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = decodedToken.user_id;
        const postId = parseInt(req.params.post_id);
        const textContent = req.body.text_content; // Assuming the text content is provided in the request body
        // Check if the post exists
        const postExists = yield (0, database_1.default)('SELECT 1 FROM posts WHERE post_id = $1', [postId]);
        if (postExists.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Check if the user has already commented on the post
        const existingComment = yield (0, database_1.default)('SELECT post_comment_id FROM post_comments WHERE post_id = $1 AND user_id = $2', [postId, userId]);
        if (existingComment.rows.length > 0) {
            // If the user has already commented on the post, update the existing comment
            const commentId = existingComment.rows[0].post_comment_id;
            yield (0, database_1.default)('UPDATE post_comments SET text_content = $1 WHERE post_comment_id = $2', [textContent, commentId]);
            return res.status(200).json({ message: 'Comment updated successfully' });
        }
        else {
            // If the user has not commented on the post, create a new comment
            yield (0, database_1.default)('INSERT INTO post_comments (post_id, user_id, text_content) VALUES ($1, $2, $3)', [postId, userId, textContent]);
            // Increment the comments_count in the posts table or set it to 1 if it's null
            yield (0, database_1.default)('UPDATE posts SET comments_count = COALESCE(comments_count, 0) + 1 WHERE post_id = $1', [postId]);
            return res.status(201).json({ message: 'Comment created successfully' });
        }
    }
    catch (error) {
        console.error('Error while creating or updating comment:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to delete a comment on a post
router.delete('/post/:post_id/:comment_id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the access token from cookies
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        // Verify the access token
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        // If the token is invalid or expired, return an unauthorized response
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = decodedToken.user_id;
        const postId = parseInt(req.params.post_id);
        const commentId = parseInt(req.params.comment_id);
        // Check if the comment exists
        const commentExists = yield (0, database_1.default)('SELECT 1 FROM post_comments WHERE post_comment_id = $1 AND post_id = $2', [commentId, postId]);
        if (commentExists.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        // Check if the user is authorized to delete the comment
        const authorizedToDelete = yield (0, database_1.default)('SELECT 1 FROM post_comments WHERE post_comment_id = $1 AND user_id = $2', [commentId, userId]);
        if (authorizedToDelete.rows.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }
        // Delete the comment
        yield (0, database_1.default)('DELETE FROM post_comments WHERE post_comment_id = $1', [commentId]);
        // Decrement the comments_count in the posts table
        yield (0, database_1.default)('UPDATE posts SET comments_count = CASE WHEN comments_count > 1 THEN comments_count - 1 ELSE NULL END WHERE post_id = $1', [postId]);
        return res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        console.error('Error while deleting comment:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
