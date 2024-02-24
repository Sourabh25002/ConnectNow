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
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_util_1 = require("../utils/jwt_util");
// Define the authenticateMiddleware function
const authenticateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the access token from the request headers
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            // Access token is not provided
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Verify the access token
        const decodedToken = (0, jwt_util_1.verifyToken)(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            // Access token is invalid or expired
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                // No refresh token provided, or it's invalid/expired
                return res.status(401).json({ error: 'Unauthorized' });
            }
            // Verify the refresh token
            const decodedRefreshToken = (0, jwt_util_1.verifyToken)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            if (!decodedRefreshToken) {
                // Refresh token is invalid or expired
                return res.status(401).json({ error: 'Unauthorized' });
            }
            // Generate a new access token
            const newAccessToken = (0, jwt_util_1.generateAccessToken)({ user_id: decodedRefreshToken.user_id, email_address: decodedRefreshToken.email_address });
            // Print the new access token for debugging
            console.log('New Access Token:', newAccessToken);
            // Set the new access token as a cookie
            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
            // Pass the new access token to the next middleware/route
            req.newAccessToken = newAccessToken;
            // Continue processing the request with the new access token
            next();
        }
        else {
            // Access token is valid, continue processing the request
            next();
        }
    }
    catch (error) {
        // Explicitly specify the type of 'error' as 'any'
        console.error('Error during authentication:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Export the authenticateMiddleware function
exports.default = authenticateMiddleware;
