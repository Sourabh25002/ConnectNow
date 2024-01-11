// routes/userDetails.ts
import { Router, Request, Response } from 'express';
import query from '../db/database';
import { UserDetails } from '../models/user_details';

const router = Router();

router.post('/user-details', async (req: Request, res: Response) => {
  try {
    const userDetails: UserDetails = req.body;

    // Validate the input (you should add more thorough validation)
    if (!userDetails.user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Insert user details into the database
    const result = await query<UserDetails>(
      'INSERT INTO user_details(user_id, fname, lname, headline, current_position, education, city, country, email, phone_no, website_link) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING user_id',
      [
        userDetails.user_id,
        userDetails.fname,
        userDetails.lname,
        userDetails.headline,
        userDetails.current_position,
        userDetails.education,
        userDetails.city,
        userDetails.country,
        userDetails.email,
        userDetails.phone_no,
        userDetails.website_link
      ]
    );

    // Successful insertion of user details
    res.status(201).json({ userId: result.rows[0].user_id, message: 'User details successfully inserted' });
  } catch (error: any) {
    // Explicitly specify the type of the error
    console.error('Error during user details insertion:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
