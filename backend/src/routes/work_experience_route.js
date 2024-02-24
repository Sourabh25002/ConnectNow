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
const jwt_util_1 = require("../utils/jwt_util");
const router = (0, express_1.Router)();
// Route to get all work experiences for a specific user
router.get('/work-experience/:userId', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Get the user_id from the URL parameters
        const userId = parseInt(req.params.userId, 10);
        // Retrieve all work experiences for the specified user
        const workExperienceResult = yield (0, database_1.default)('SELECT * FROM work_experience WHERE user_id = $1', [userId]);
        res.status(200).json({ workExperience: workExperienceResult.rows });
    }
    catch (error) {
        console.error('Error while retrieving work experiences:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to delete a specific work experience entry
router.delete('/work-experience/:experienceId', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const experienceId = parseInt(req.params.experienceId, 10);
        // Check if the work experience entry exists for the authenticated user
        const existingExperienceResult = yield (0, database_1.default)('SELECT * FROM work_experience WHERE user_id = $1 AND experience_id = $2', [userId, experienceId]);
        if (existingExperienceResult.rows.length === 0) {
            return res.status(404).json({ error: 'Work experience entry not found' });
        }
        // Delete the work experience entry
        yield (0, database_1.default)('DELETE FROM work_experience WHERE user_id = $1 AND experience_id = $2', [userId, experienceId]);
        res.status(200).json({ message: 'Work experience entry deleted successfully' });
    }
    catch (error) {
        console.error('Error while deleting work experience entry:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to store or update work experience data
// Route to store or update work experience data
router.post('/work-experience', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Check if the request body contains experienceId
        const experienceId = req.body.experience_id;
        if (req.body.experience_id) {
            // Experience ID exists, update the existing record
            const experienceId = parseInt(req.body.experience_id, 10);
            yield updateWorkExperience(userId, experienceId, req.body);
            res.status(200).json({ message: 'Work experience updated successfully' });
        }
        else {
            // Experience ID does not exist, create a new record
            yield createWorkExperience(userId, req.body);
            res.status(201).json({ message: 'Work experience created successfully' });
        }
    }
    catch (error) {
        console.error('Error while storing/updating work experience:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Helper function to create a new work experience record
const createWorkExperience = (userId, experienceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const columns = Object.keys(experienceData).filter(key => key !== 'experience_id'); // Exclude experience_id
        const values = Object.values(experienceData).filter(value => value !== undefined);
        const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
        const queryText = `INSERT INTO work_experience (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;
        yield (0, database_1.default)(queryText, [userId, ...values]);
    }
    catch (error) {
        console.error('Error while creating work experience:', error.message);
        throw new Error('Internal Server Error');
    }
});
// Helper function to update an existing work experience record
const updateWorkExperience = (userId, experienceId, experienceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setClause = Object.keys(experienceData)
            .filter(key => key !== 'experience_id') // Exclude experience_id from update
            .map((key, index) => `${key} = $${index + 3}`)
            .join(', ');
        const queryText = `UPDATE work_experience SET ${setClause} WHERE user_id = $1 AND experience_id = $2`;
        const values = [userId, experienceId, ...Object.values(experienceData).filter(value => value !== undefined)];
        yield (0, database_1.default)(queryText, values);
    }
    catch (error) {
        console.error('Error while updating work experience:', error.message);
        throw new Error('Internal Server Error');
    }
});
exports.default = router;
