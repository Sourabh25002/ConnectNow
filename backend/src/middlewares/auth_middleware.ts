import { Request, Response, NextFunction } from 'express';
import { verifyToken, generateAccessToken, generateRefreshToken } from '../utils/jwt_util';

// Extend the Request interface to include the newAccessToken property
declare module 'express' {
  interface Request {
    newAccessToken?: string;
  }
}

// Define the authenticateMiddleware function
const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the access token from the request headers
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      // Access token is not provided
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the access token
    const decodedToken = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as string);

    if (!decodedToken) {
      // Access token is invalid or expired
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        // No refresh token provided, or it's invalid/expired
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Verify the refresh token
      const decodedRefreshToken = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

      if (!decodedRefreshToken) {
        // Refresh token is invalid or expired
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a new access token
      const newAccessToken = generateAccessToken({ user_id: decodedRefreshToken.user_id, email_address: decodedRefreshToken.email_address });

      // Print the new access token for debugging
      console.log('New Access Token:', newAccessToken);

      // Set the new access token as a cookie
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });

      // Pass the new access token to the next middleware/route
      req.newAccessToken = newAccessToken;

      // Continue processing the request with the new access token
      next();
    } else {
      // Access token is valid, continue processing the request
      next();
    }
  } catch (error: any) {
    // Explicitly specify the type of 'error' as 'any'
    console.error('Error during authentication:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export the authenticateMiddleware function
export default authenticateMiddleware;
