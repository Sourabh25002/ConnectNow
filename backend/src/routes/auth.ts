import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import query from '../db/database';
import { User } from '../models/users';

const router = Router();

// Signup Route
router.post('/signUp', async (req: Request, res: Response) => {
  try {
    let { email, password }: User = req.body;

    // Validate the input 
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Trim leading and trailing whitespaces
    email = email.trim();
    password = password.trim();

    // Check if the email is already registered
    const emailExistsResult = await query<User>('SELECT * FROM users WHERE email = $1', [email]);

    if (emailExistsResult.rows.length > 0) {
      // Email is already registered
      return res.status(400).json({ error: 'Email is already registered. Please use a different email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await query<User>('INSERT INTO users(email, password) VALUES($1, $2) RETURNING id', [email, hashedPassword]);

    // Successful sign-up
    res.status(201).json({ userId: result.rows[0].id, message: 'User successfully registered' });
  } catch (error: any) {
    // Handle errors during sign-up
    console.error('Error during sign-up:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: User = req.body;

    // Validate the input 
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Retrieve the user from the database
    const userResult = await query<User>('SELECT * FROM users WHERE email = $1', [email]);

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
    res.status(200).json({ userId: user.id, message: 'Login successful' });
  } catch (error: any) {
    // Handle errors during login
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
