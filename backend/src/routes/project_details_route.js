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
const jwt_util_1 = require("../utils/jwt_util");
const router = (0, express_1.Router)();
// Route to get user project details
router.get('/projects', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = decodedToken.user_id;
        const projectDetailsResult = yield (0, database_1.default)('SELECT * FROM project_details WHERE user_id = $1', [userId]);
        res.status(200).json({ projectDetails: projectDetailsResult.rows });
    }
    catch (error) {
        console.error('Error while retrieving project details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to create or update user project details
router.post('/projects', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = decodedToken.user_id;
        if (req.body.project_detail_id) {
            yield updateProjectDetails(userId, req.body);
            res.status(200).json({ message: 'Project details updated successfully' });
        }
        else {
            yield createProjectDetails(userId, req.body);
            res.status(201).json({ message: 'Project details created successfully' });
        }
    }
    catch (error) {
        console.error('Error while storing/updating project details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to delete a specific project entry
router.delete('/projects/:projectId', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.newAccessToken || req.cookies.accessToken;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, accessSecret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = decodedToken.user_id;
        const projectId = parseInt(req.params.projectId, 10);
        const existingProjectResult = yield (0, database_1.default)('SELECT * FROM project_details WHERE user_id = $1 AND project_detail_id = $2', [userId, projectId]);
        if (existingProjectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project entry not found' });
        }
        yield (0, database_1.default)('DELETE FROM project_details WHERE user_id = $1 AND project_detail_id = $2', [userId, projectId]);
        res.status(200).json({ message: 'Project entry deleted successfully' });
    }
    catch (error) {
        console.error('Error while deleting project entry:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Helper function to create a new project details entry
const createProjectDetails = (userId, projectData) => __awaiter(void 0, void 0, void 0, function* () {
    const columns = Object.keys(projectData);
    const values = Object.values(projectData);
    const placeholders = values.map((value, index) => {
        if (value instanceof Date) {
            return `$${index + 2}::date`;
        }
        else {
            return `$${index + 2}`;
        }
    }).join(', ');
    const queryText = `INSERT INTO project_details (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;
    yield (0, database_1.default)(queryText, [userId, ...values]);
});
// Helper function to update an existing project details entry
const updateProjectDetails = (userId, projectData) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = projectData, { project_detail_id: _ } = _a, updateData = __rest(_a, ["project_detail_id"]);
    const setClause = Object.keys(updateData)
        .map((key, index) => {
        if (updateData[key] instanceof Date) {
            return `${key} = $${index + 2}::date`;
        }
        else {
            return `${key} = $${index + 2}`;
        }
    })
        .join(', ');
    // Ensure that placeholders match the number of parameters
    const placeholders = [...Array(Object.keys(updateData).length).keys()]
        .map(index => `$${index + 2}`)
        .join(', ');
    const queryText = `UPDATE project_details SET ${setClause} WHERE user_id = $1 AND project_detail_id = $${Object.keys(updateData).length + 2} AND project_detail_id = $${Object.keys(updateData).length + 3}`;
    yield (0, database_1.default)(queryText, [userId, projectData.project_detail_id, projectData.project_detail_id, ...Object.values(updateData)]);
});
exports.default = router;
