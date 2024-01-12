import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import query from '../db/database';
import { users_account } from '../models/users';  

const router = Router();

// Signup Route
router.post('/signUp', async (req: Request, res: Response) => {
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
    res.status(201).json({ userId: result.rows[0].user_id, message: 'User successfully registered' });
  } catch (error: any) {
    // Handle errors during sign-up
    console.error('Error during sign-up:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Route
router.post('/login', async (req: Request, res: Response) => {
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
    res.status(200).json({ userId: user.user_id, message: 'Login successful' });
  } catch (error: any) {
    // Handle errors during login
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
