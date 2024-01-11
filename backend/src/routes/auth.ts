// routes/signUp.ts
import { Router, Request, Response } from 'express';
import query from '../db/database';
import { User } from '../models/users';

const router = Router();

router.post('/signUp', async (req: Request, res: Response) => {
  try {
    const { email, password }: User = req.body;

    // Validate the input 
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if the email is already registered
    const emailExistsResult = await query<User>('SELECT * FROM users WHERE email = $1', [email]);

    if (emailExistsResult.rows.length > 0) {
      // Email is already registered
      return res.status(400).json({ error: 'Email is already registered. Please use a different email.' });
    }

    // Insert the user into the database
    const result = await query<User>('INSERT INTO users(email, password) VALUES($1, $2) RETURNING id', [email, password]);

    // Successful sign-up
    res.status(201).json({ userId: result.rows[0].id, message: 'User successfully registered' });
  } catch (error: any) {
    // Explicitly specify the type of the error
    console.error('Error during sign-up:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
