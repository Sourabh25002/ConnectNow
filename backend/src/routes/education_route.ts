import { Router, Request, Response } from 'express';
import authenticateMiddleware from '../middlewares/auth_middleware';
import query from '../db/database';
import { verifyToken } from '../utils/jwt_util';
import { education } from '../models/education_model';
import { users_account } from '../models/users_account_model';

// Extend the Request interface to include custom properties
declare module 'express' {
  interface Request {
    newAccessToken?: string;
    user?: users_account;
  }
}

const router = Router();

// Route to store or update user education data
router.post('/education', authenticateMiddleware, async (req: Request, res: Response) => {
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

    // Check if the education entry already exists
    const existingEducationResult = await query<education>('SELECT * FROM education WHERE user_id = $1', [userId]);

    if (existingEducationResult.rows.length > 0) {
      // Education entry already exists, update the data
      await updateEducation(userId, req.body);
      res.status(200).json({ message: 'Education details updated successfully' });
    } else {
      // Education entry doesn't exist, create a new entry
      await createEducation(userId, req.body);
      res.status(201).json({ message: 'Education details created successfully' });
    }
  } catch (error: any) {
    console.error('Error while storing/updating education details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to create a new education entry
const createEducation = async (userId: number, educationData: Partial<education>) => {
  const columns = Object.keys(educationData);
  const values = Object.values(educationData);
  
  const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
  const queryText = `INSERT INTO education (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;

  await query(queryText, [userId, ...values]);
};

// Helper function to update an existing education entry
const updateEducation = async (userId: number, educationData: Partial<education>) => {
  const setClause = Object.keys(educationData)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');

  const queryText = `UPDATE education SET ${setClause} WHERE user_id = $1`;
  await query(queryText, [userId, ...Object.values(educationData)]);
};

export default router;
