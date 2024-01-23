// work_experience_routes.ts

import { Router, Request, Response } from 'express';
import authenticateMiddleware from '../middlewares/auth_middleware';
import query from '../db/database';
import { verifyToken } from '../utils/jwt_util';
import { work_experience } from '../models/work_experience_model';
import { users_account } from '../models/users_account_model';

declare module 'express' {
  interface Request {
    newAccessToken?: string;
    user?: users_account;
  }
}

const router = Router();

// Route to store or update work experience data
router.post('/work-experience', authenticateMiddleware, async (req: Request, res: Response) => {
  try {
    // Verify the access token from cookies
    const accessToken = req.newAccessToken || req.cookies.accessToken;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;

    // Verify the access token
    const decodedToken = verifyToken(accessToken, accessSecret);

    // If the token is invalid or expired, return an unauthorized response
    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId: number = decodedToken.user_id;

    // Check if the work experience record already exists
    const existingExperienceResult = await query<work_experience>('SELECT * FROM work_experience WHERE user_id = $1', [userId]);

    if (existingExperienceResult.rows.length > 0) {
      // Work experience record already exists, update the data
      await updateWorkExperience(userId, req.body);
      res.status(200).json({ message: 'Work experience updated successfully' });
    } else {
      // Work experience record doesn't exist, create a new record
      await createWorkExperience(userId, req.body);
      res.status(201).json({ message: 'Work experience created successfully' });
    }
  } catch (error: any) {
    console.error('Error while storing/updating work experience:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to create a new work experience record
const createWorkExperience = async (userId: number, experienceData: Partial<work_experience>) => {
  const columns = Object.keys(experienceData);
  const values = Object.values(experienceData);

  const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
  const queryText = `INSERT INTO work_experience (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;

  await query(queryText, [userId, ...values]);
};

// Helper function to update an existing work experience record
const updateWorkExperience = async (userId: number, experienceData: Partial<work_experience>) => {
  const setClause = Object.keys(experienceData)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');

  const queryText = `UPDATE work_experience SET ${setClause} WHERE user_id = $1`;
  await query(queryText, [userId, ...Object.values(experienceData)]);
};

export default router;
