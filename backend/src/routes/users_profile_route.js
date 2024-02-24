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
// Route to retrieve user profile data
router.get('/profile/details', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Retrieve user profile data from the database
        const userProfileResult = yield (0, database_1.default)('SELECT * FROM users_profile WHERE user_id = $1', [userId]);
        if (userProfileResult.rows.length > 0) {
            // User profile exists, send the data in the response
            const userProfileData = userProfileResult.rows[0];
            res.status(200).json({ userProfile: userProfileData });
        }
        else {
            // User profile doesn't exist, send a not found response
            res.status(404).json({ error: 'User profile not found' });
        }
    }
    catch (error) {
        console.error('Error while retrieving user profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.get('/profile/:user_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.user_id); // Extract user_id from URL params
        // Retrieve user profile data from the database
        const userProfileResult = yield (0, database_1.default)('SELECT * FROM users_profile WHERE user_id = $1', [userId]);
        if (userProfileResult.rows.length > 0) {
            // User profile exists, send the data in the response
            const userProfileData = userProfileResult.rows[0];
            res.status(200).json({ userProfile: userProfileData });
        }
        else {
            // User profile doesn't exist, send a not found response
            res.status(404).json({ error: 'User profile not found' });
        }
    }
    catch (error) {
        console.error('Error while retrieving user profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to get all user IDs except the logged-in user and connected users
router.get('/users/all', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const loggedInUserId = decodedToken.user_id;
        // Retrieve all user IDs except the logged-in user and connected users
        const userIDsResult = yield (0, database_1.default)('SELECT user_id FROM users_account WHERE user_id != $1 AND user_id NOT IN (SELECT followed_id FROM connections WHERE follower_id = $1)', [loggedInUserId]);
        const userIds = userIDsResult.rows.map(row => row.user_id);
        res.status(200).json({ userIDs: userIds });
    }
    catch (error) {
        console.error('Error while retrieving user IDs:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to store or update user profile data
router.post('/profile', auth_middleware_1.default, multer_middleware_1.upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 }
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
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
        // Check if the user profile already exists
        const existingProfileResult = yield (0, database_1.default)('SELECT * FROM users_profile WHERE user_id = $1', [userId]);
        // Handle uploading images to Cloudinary and updating database
        if (req.files && typeof req.files === 'object') {
            const files = req.files;
            // Check if 'profile_picture' field exists and get the file path
            const profilePictureFilePath = (files['profile_picture'] && ((_a = files['profile_picture'][0]) === null || _a === void 0 ? void 0 : _a.path)) || null;
            // Check if 'cover_photo' field exists and get the file path
            const coverPhotoFilePath = (files['cover_photo'] && ((_b = files['cover_photo'][0]) === null || _b === void 0 ? void 0 : _b.path)) || null;
            // Upload images to Cloudinary
            const profilePictureUrl = profilePictureFilePath ? yield (0, cloudinary_util_1.uploadOnCloudinary)(profilePictureFilePath) : (((_c = existingProfileResult.rows[0]) === null || _c === void 0 ? void 0 : _c.profile_picture_url) || null);
            const coverPhotoUrl = coverPhotoFilePath ? yield (0, cloudinary_util_1.uploadOnCloudinary)(coverPhotoFilePath) : (((_d = existingProfileResult.rows[0]) === null || _d === void 0 ? void 0 : _d.cover_photo_url) || null);
            // Update the user profile data in the database
            if (existingProfileResult.rows.length > 0) {
                // User profile already exists, update the data including image URLs
                yield updateProfile(userId, Object.assign(Object.assign({}, req.body), { profile_picture_url: profilePictureUrl, cover_photo_url: coverPhotoUrl }));
                res.status(200).json({ message: 'User profile updated successfully' });
            }
            else {
                // User profile doesn't exist, create a new profile including image URLs
                yield createProfile(userId, Object.assign(Object.assign({}, req.body), { profile_picture_url: profilePictureUrl, cover_photo_url: coverPhotoUrl }));
                res.status(201).json({ message: 'User profile created successfully' });
            }
        }
        else {
            // If no files were uploaded, update the user profile data without images
            if (existingProfileResult.rows.length > 0) {
                // User profile already exists, update the data without images
                yield updateProfile(userId, req.body);
                res.status(200).json({ message: 'User profile updated successfully' });
            }
            else {
                // User profile doesn't exist, create a new profile without images
                yield createProfile(userId, req.body);
                res.status(201).json({ message: 'User profile created successfully' });
            }
        }
    }
    catch (error) {
        console.error('Error while storing/updating user profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Helper function to create a new user profile
const createProfile = (userId, profileData) => __awaiter(void 0, void 0, void 0, function* () {
    const columns = Object.keys(profileData);
    const values = Object.values(profileData);
    const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
    const queryText = `INSERT INTO users_profile (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;
    yield (0, database_1.default)(queryText, [userId, ...values]);
});
// Helper function to update an existing user profile
const updateProfile = (userId, profileData) => __awaiter(void 0, void 0, void 0, function* () {
    const setClause = Object.keys(profileData)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
    const queryText = `UPDATE users_profile SET ${setClause} WHERE user_id = $1`;
    yield (0, database_1.default)(queryText, [userId, ...Object.values(profileData)]);
});
exports.default = router;
