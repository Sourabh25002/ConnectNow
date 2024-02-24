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
const auth_middleware_1 = __importDefault(require("../middlewares/auth_middleware"));
const database_1 = __importDefault(require("../db/database"));
const multer_middleware_1 = require("../middlewares/multer_middleware");
const cloudinary_util_1 = require("../utils/cloudinary_util");
const jwt_util_1 = require("../utils/jwt_util");
const router = (0, express_1.Router)();
// GET request to retrieve all posts of a particular user by user_id
router.get('/posts/:user_id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Extract user_id from request parameters
        const { user_id } = req.params;
        // Ensure the authenticated user matches the requested user_id
        if (decodedToken.user_id !== parseInt(user_id, 10)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        // Retrieve all posts of the specified user from the database
        const postsResult = yield (0, database_1.default)('SELECT * FROM posts WHERE user_id = $1', [user_id]);
        // Send the retrieved posts in the response
        res.status(200).json({ posts: postsResult.rows });
    }
    catch (error) {
        console.error('Error while retrieving user posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to create a new post
router.post('/posts', auth_middleware_1.default, multer_middleware_1.upload.single('media_link'), // Assuming 'media_link' is the field name for the file
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        // Check if both content and media_link are provided in the request body
        const { content } = req.body;
        const media_link = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || ''; // Assuming the file path is stored in req.file.path
        if (!content || !media_link) {
            return res.status(400).json({ error: 'Content and media link are required' });
        }
        // Extract the URL from the media link
        const mediaUrl = yield (0, cloudinary_util_1.uploadOnCloudinary)(media_link);
        // Insert the post into the database
        const result = yield (0, database_1.default)('INSERT INTO posts (user_id, content, media_link) VALUES ($1, $2, $3) RETURNING *', [userId, content, mediaUrl]);
        // Respond with the created post
        res.status(201).json({ message: 'Post created successfully', post: result.rows[0] });
    }
    catch (error) {
        console.error('Error while creating post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.put('/posts/:post_id', auth_middleware_1.default, multer_middleware_1.upload.single('media_link'), // Assuming 'media_link' is the field name for the file
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Check if the post exists and if the authenticated user is the owner of the post
        const postResult = yield (0, database_1.default)('SELECT * FROM posts WHERE post_id = $1', [postId]);
        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const post = postResult.rows[0];
        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        // Check if any data is provided in the request body
        const { content } = req.body;
        let media_link = post.media_link; // Default to the existing media link
        // Check if a file was uploaded
        if (req.file) {
            // Extract the URL from the media link
            const uploadedMedia = yield (0, cloudinary_util_1.uploadOnCloudinary)(req.file.path);
            if (uploadedMedia !== null) {
                media_link = uploadedMedia.url; // Extracting URL from the UploadApiResponse object
            }
            else {
                // Handle case where uploadOnCloudinary returns null
                console.error('Failed to upload media to Cloudinary');
                // Optionally handle the error or fallback behavior
            }
        }
        // Update only the fields provided by the user
        const updates = {};
        if (content)
            updates.content = content;
        if (media_link)
            updates.media_link = media_link;
        // Update the post in the database
        const result = yield (0, database_1.default)('UPDATE posts SET content = COALESCE($1, content), media_link = COALESCE($2, media_link) WHERE post_id = $3 RETURNING *', [updates.content, updates.media_link, postId]);
        // Respond with the updated post
        res.status(200).json({ message: 'Post updated successfully', post: result.rows[0] });
    }
    catch (error) {
        console.error('Error while updating post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// DELETE route to delete a post
router.delete('/posts/:post_id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Check if the post exists and if the authenticated user is the owner of the post
        const postResult = yield (0, database_1.default)('SELECT * FROM posts WHERE post_id = $1', [postId]);
        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const post = postResult.rows[0];
        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        // Delete the post from the posts table
        yield (0, database_1.default)('DELETE FROM posts WHERE post_id = $1', [postId]);
        // Delete associated rows from post_likes and post_comments tables
        yield (0, database_1.default)('DELETE FROM post_likes WHERE post_id = $1', [postId]);
        yield (0, database_1.default)('DELETE FROM post_comments WHERE post_id = $1', [postId]);
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error('Error while deleting post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
