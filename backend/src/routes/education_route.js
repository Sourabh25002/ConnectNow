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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth_middleware"));
const database_1 = __importDefault(require("../db/database"));
const multer_middleware_1 = require("../middlewares/multer_middleware");
const jwt_util_1 = require("../utils/jwt_util");
const router = (0, express_1.Router)();
// Route to create or update user education data
router.post('/education', auth_middleware_1.default, multer_middleware_1.upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Create or update education entry
        if (req.body.education_id) {
            yield updateEducation(userId, req.body);
            res.status(200).json({ message: 'Education details updated successfully' });
        }
        else {
            yield createEducation(userId, req.body);
            res.status(201).json({ message: 'Education details created successfully' });
        }
    }
    catch (error) {
        console.error('Error while storing/updating education details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to list all education entries for a user
router.get('/education', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Retrieve all education entries for the authenticated user
        const educationEntriesResult = yield (0, database_1.default)('SELECT * FROM education WHERE user_id = $1', [userId]);
        res.status(200).json({ educationEntries: educationEntriesResult.rows });
    }
    catch (error) {
        console.error('Error while retrieving education entries:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to delete a specific education entry
router.delete('/education/:educationId', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const educationId = parseInt(req.params.educationId, 10);
        // Check if the education entry exists for the authenticated user
        const existingEducationResult = yield (0, database_1.default)('SELECT * FROM education WHERE user_id = $1 AND education_id = $2', [userId, educationId]);
        if (existingEducationResult.rows.length === 0) {
            return res.status(404).json({ error: 'Education entry not found' });
        }
        // Delete the education entry
        yield (0, database_1.default)('DELETE FROM education WHERE user_id = $1 AND education_id = $2', [userId, educationId]);
        res.status(200).json({ message: 'Education entry deleted successfully' });
    }
    catch (error) {
        console.error('Error while deleting education entry:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Helper function to create a new education entry
const createEducation = (userId, educationData) => __awaiter(void 0, void 0, void 0, function* () {
    const columns = Object.keys(educationData);
    const values = Object.values(educationData);
    const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
    const queryText = `INSERT INTO education (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;
    yield (0, database_1.default)(queryText, [userId, ...values]);
});
// Helper function to update an existing education entry
const updateEducation = (userId, educationData) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract education_id from educationData
    const { education_id } = educationData, updateData = __rest(educationData, ["education_id"]);
    const setClause = Object.keys(updateData)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
    // Ensure that placeholders match the number of parameters
    const placeholders = [...Array(Object.keys(updateData).length).keys()]
        .map(index => `$${index + 2}`)
        .join(', ');
    const queryText = `UPDATE education SET ${setClause} WHERE user_id = $1 AND education_id = $${Object.keys(updateData).length + 2}`;
    // Execute the query
    yield (0, database_1.default)(queryText, [userId, ...Object.values(updateData), education_id]);
});
exports.default = router;
