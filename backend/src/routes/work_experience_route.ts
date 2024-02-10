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

// Route to get all work experiences for a specific user
router.get('/work-experience/:userId', authenticateMiddleware, async (req: Request, res: Response) => {
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

    // Get the user_id from the URL parameters
    const userId: number = parseInt(req.params.userId, 10);

    // Retrieve all work experiences for the specified user
    const workExperienceResult = await query<work_experience>('SELECT * FROM work_experience WHERE user_id = $1', [userId]);

    res.status(200).json({ workExperience: workExperienceResult.rows });
  } catch (error: any) {
    console.error('Error while retrieving work experiences:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to delete a specific work experience entry
router.delete('/work-experience/:experienceId', authenticateMiddleware, async (req: Request, res: Response) => {
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
    const experienceId: number = parseInt(req.params.experienceId, 10);

    // Check if the work experience entry exists for the authenticated user
    const existingExperienceResult = await query<work_experience>('SELECT * FROM work_experience WHERE user_id = $1 AND experience_id = $2', [userId, experienceId]);

    if (existingExperienceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Work experience entry not found' });
    }

    // Delete the work experience entry
    await query('DELETE FROM work_experience WHERE user_id = $1 AND experience_id = $2', [userId, experienceId]);

    res.status(200).json({ message: 'Work experience entry deleted successfully' });
  } catch (error: any) {
    console.error('Error while deleting work experience entry:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to store or update work experience data
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

    // Check if the request body contains experienceId
    const experienceId: number | undefined = req.body.experience_id;

    if (req.body.experience_id) {
      // Experience ID exists, update the existing record
      const experienceId: number = parseInt(req.body.experience_id, 10);
      await updateWorkExperience(userId, experienceId, req.body);
      res.status(200).json({ message: 'Work experience updated successfully' });
  } else {
      // Experience ID does not exist, create a new record
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
  try {
    const columns = Object.keys(experienceData).filter(key => key !== 'experience_id'); // Exclude experience_id
    const values = Object.values(experienceData).filter(value => value !== undefined);

    const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
    const queryText = `INSERT INTO work_experience (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;

    await query(queryText, [userId, ...values]);
  } catch (error: any) {
    console.error('Error while creating work experience:', error.message);
    throw new Error('Internal Server Error');
  }
};


// Helper function to update an existing work experience record
const updateWorkExperience = async (userId: number, experienceId: number, experienceData: Partial<work_experience>) => {
  try {
    const setClause = Object.keys(experienceData)
      .filter(key => key !== 'experience_id') // Exclude experience_id from update
      .map((key, index) => `${key} = $${index + 3}`)
      .join(', ');

    const queryText = `UPDATE work_experience SET ${setClause} WHERE user_id = $1 AND experience_id = $2`;
    const values = [userId, experienceId, ...Object.values(experienceData).filter(value => value !== undefined)];

    await query(queryText, values);
  } catch (error: any) {
    console.error('Error while updating work experience:', error.message);
    throw new Error('Internal Server Error');
  }
};



export default router;
