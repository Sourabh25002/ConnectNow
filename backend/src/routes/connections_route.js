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
const jwt_util_1 = require("../utils/jwt_util");
const database_1 = __importDefault(require("../db/database"));
const router = (0, express_1.Router)();
// Route to get all followed users for a particular user
router.get('/following', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = decodedToken.user_id;
        // Retrieve all users followed by the particular user
        const followedUsersResult = yield (0, database_1.default)('SELECT * FROM connections WHERE follower_id = $1', [userId]);
        res.status(200).json({ followedUsers: followedUsersResult.rows });
    }
    catch (error) {
        console.error('Error while retrieving followed users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to create a new connection
router.post('/connection', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const followerId = decodedToken.user_id;
        const { followedId } = req.body;
        // Check if followedId exists
        const followedExistsResult = yield (0, database_1.default)('SELECT * FROM users_account WHERE user_id = $1', [followedId]);
        if (followedExistsResult.rows.length === 0) {
            return res.status(404).json({ error: 'Followed user not found' });
        }
        // Check if the connection already exists
        const connectionExistsResult = yield (0, database_1.default)('SELECT * FROM connections WHERE follower_id = $1 AND followed_id = $2', [followerId, followedId]);
        if (connectionExistsResult.rows.length > 0) {
            return res.status(400).json({ error: 'Connection already exists' });
        }
        // Insert the new connection
        yield (0, database_1.default)('INSERT INTO connections (follower_id, followed_id) VALUES ($1, $2)', [followerId, followedId]);
        res.status(201).json({ message: 'Connection created successfully' });
    }
    catch (error) {
        console.error('Error while creating connection:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to unfollow a user
router.delete('/connection/:followedId', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const followerId = decodedToken.user_id;
        const followedId = parseInt(req.params.followedId, 10); // Use followedId from route params
        // Check if the connection exists
        const connectionExistsResult = yield (0, database_1.default)('SELECT * FROM connections WHERE follower_id = $1 AND followed_id = $2', [followerId, followedId]);
        if (connectionExistsResult.rows.length === 0) {
            return res.status(404).json({ error: 'Connection not found' });
        }
        // Delete the connection
        yield (0, database_1.default)('DELETE FROM connections WHERE follower_id = $1 AND followed_id = $2', [followerId, followedId]);
        res.status(200).json({ message: 'Unfollowed successfully' });
    }
    catch (error) {
        console.error('Error while unfollowing:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
