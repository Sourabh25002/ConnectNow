import { Router, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import query from '../db/database';
import { upload } from '../middlewares/multer_middleware';
import { users_account } from '../models/users_account_model';  
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt_util';
import authenticateMiddleware from '../middlewares/auth_middleware';

const router = Router();
router.use(cookieParser());

// Signup Route
router.post('/signUp', upload.none(), async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    let { email_address, password }: users_account = req.body;

    // Validate the input
    if (!email_address || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Trim leading and trailing whitespaces
    email_address = email_address.trim();
    password = password.trim();

    // Check if the email is already registered
    const emailExistsResult = await query<users_account>('SELECT * FROM users_account WHERE email_address = $1', [email_address]);

    if (emailExistsResult.rows.length > 0) {
      // Email is already registered
      return res.status(400).json({ error: 'Email is already registered. Please use a different email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await query<users_account>('INSERT INTO users_account(email_address, password) VALUES($1, $2) RETURNING user_id', [email_address, hashedPassword]);

    // Successful sign-up

    // Generate tokens
    const accessToken = generateAccessToken({ user_id: result.rows[0].user_id, email_address });
    const refreshToken = generateRefreshToken({ user_id: result.rows[0].user_id, email_address });

    // Store the refresh token in the database
    await query<users_account>('UPDATE users_account SET refresh_token = $1 WHERE user_id = $2', [refreshToken, result.rows[0].user_id]);

    // Send tokens as cookies
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });

    // Send user ID and tokens in the response
    res.status(201).json({ userId: result.rows[0].user_id, accessToken, refreshToken, message: 'User successfully registered and logged in' });
  } catch (error: any) {
    // Handle errors during sign-up
    console.error('Error during sign-up:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Login Route
router.post('/login', upload.none(), async (req: Request, res: Response) => {
  try {
    const { email_address, password }: users_account = req.body;

    // Validate the input 
    if (!email_address || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Retrieve the user from the database
    const userResult = await query<users_account>('SELECT * FROM users_account WHERE email_address = $1', [email_address]);

    if (userResult.rows.length === 0) {
      // User not found
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Passwords do not match
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login
    const userId = user.user_id;

    // Generate tokens
    const accessToken = generateAccessToken({ user_id: userId, email_address });
    const refreshToken = generateRefreshToken({ user_id: userId, email_address });

    // Store the refresh token in the database
    await query<users_account>('UPDATE users_account SET refresh_token = $1 WHERE user_id = $2', [refreshToken, userId]);

    // Send tokens and user ID in the response
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' }); 

    // Send tokens and user ID in the response
    res.status(200).json({ userId, accessToken, refreshToken, message: 'Login successful' });
  } catch (error: any) {
    // Handle errors during login
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Logout Route
router.post('/logout', authenticateMiddleware, upload.none(), async (req: Request, res: Response) => {
  try {
    // The authentication middleware will handle token refresh if needed

    // Verify the access token from cookies
    const accessToken = req.newAccessToken || req.cookies.accessToken;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string; // Use your environment variable

    // Log the access token
    console.log('Access Token:', accessToken);

    // Verify the access token
    const decodedToken = verifyToken(accessToken, accessSecret);

    // Log the decoded token
    console.log('Decoded Token:', decodedToken);

    // If the token is invalid or expired, return an unauthorized response
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract the user ID from the decoded token
    const userId: number = decodedToken.user_id;

    // Clear the refresh token in the database (assuming you have a users_account table)
    await query<users_account>('UPDATE users_account SET refresh_token = NULL WHERE user_id = $1', [userId]);

    // Clear the access and refresh tokens from cookies
    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });

    if (req.newAccessToken) {
      // If the middleware provided a new access token, use it
      // Set the new access token as a cookie
      res.cookie('accessToken', req.newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    } else {
      // Generate a new access token
      const newAccessToken = generateAccessToken({ user_id: userId, email_address: '' /* Replace with the actual email address */ });

      // Set the new access token as a cookie
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    }

    // Respond with a successful logout message
    res.status(200).json({ message: 'Logout successful' });
  } catch (error: any) {
    // Log and respond with an internal server error if an exception occurs
    console.error('Error during logout:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;
