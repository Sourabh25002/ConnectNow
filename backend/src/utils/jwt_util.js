"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
// Retrieve secret keys and token expiry durations from environment variables
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const accessExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY;
// Function to generate an access token based on the provided payload
function generateAccessToken(payload) {
    return (0, jsonwebtoken_1.sign)(payload, accessSecret, { expiresIn: accessExpiry });
}
exports.generateAccessToken = generateAccessToken;
// Function to generate a refresh token based on the provided payload
function generateRefreshToken(payload) {
    return (0, jsonwebtoken_1.sign)(payload, refreshSecret, { expiresIn: refreshExpiry });
}
exports.generateRefreshToken = generateRefreshToken;
// Function to verify a token using the provided secret key
function verifyToken(token, secret) {
    try {
        // Verify the token and cast the decoded result to the TokenPayload type
        const decoded = (0, jsonwebtoken_1.verify)(token, secret);
        return decoded;
    }
    catch (error) {
        // If verification fails, return null
        return null;
    }
}
exports.verifyToken = verifyToken;
