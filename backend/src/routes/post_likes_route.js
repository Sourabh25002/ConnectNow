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
const router = (0, express_1.Router)();
// Route to like or unlike a post
router.post('/post/:post_id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Check if the post exists
        const postExists = yield (0, database_1.default)('SELECT 1 FROM posts WHERE post_id = $1', [postId]);
        if (postExists.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Check if the user has already liked the post
        const existingLike = yield (0, database_1.default)('SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
        if (existingLike.rows.length > 0) {
            // If the user has already liked the post, delete the row
            yield (0, database_1.default)('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
            // Decrement the likes_count in the posts table
            yield (0, database_1.default)('UPDATE posts SET likes_count = CASE WHEN likes_count = 1 THEN NULL ELSE likes_count - 1 END WHERE post_id = $1', [postId]);
            return res.status(200).json({ message: 'Post unliked successfully' });
        }
        else {
            // If the user has not liked the post, create the row
            yield (0, database_1.default)('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
            // Increment the likes_count in the posts table
            yield (0, database_1.default)('UPDATE posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE post_id = $1', [postId]);
            return res.status(201).json({ message: 'Post liked successfully' });
        }
    }
    catch (error) {
        console.error('Error while liking post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
