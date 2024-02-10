import { Router, Request, Response } from 'express';
import authenticateMiddleware from '../middlewares/auth_middleware';
import query from '../db/database';
import { upload } from '../middlewares/multer_middleware';
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

// Route to create or update user education data
router.post('/education', authenticateMiddleware,  upload.none(), async (req: Request, res: Response) => {
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

    // Create or update education entry
    if (req.body.education_id) {
      await updateEducation(userId, req.body);
      res.status(200).json({ message: 'Education details updated successfully' });
    } else {
      await createEducation(userId, req.body);
      res.status(201).json({ message: 'Education details created successfully' });
    }
  } catch (error: any) {
    console.error('Error while storing/updating education details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to list all education entries for a user
router.get('/education', authenticateMiddleware, async (req: Request, res: Response) => {
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

    // Retrieve all education entries for the authenticated user
    const educationEntriesResult = await query<education>('SELECT * FROM education WHERE user_id = $1', [userId]);

    res.status(200).json({ educationEntries: educationEntriesResult.rows });
  } catch (error: any) {
    console.error('Error while retrieving education entries:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a specific education entry
router.delete('/education/:educationId', authenticateMiddleware, async (req: Request, res: Response) => {
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
    const educationId: number = parseInt(req.params.educationId, 10);

    // Check if the education entry exists for the authenticated user
    const existingEducationResult = await query<education>('SELECT * FROM education WHERE user_id = $1 AND education_id = $2', [userId, educationId]);

    if (existingEducationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    // Delete the education entry
    await query('DELETE FROM education WHERE user_id = $1 AND education_id = $2', [userId, educationId]);

    res.status(200).json({ message: 'Education entry deleted successfully' });
  } catch (error: any) {
    console.error('Error while deleting education entry:', error.message);
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
  // Extract education_id from educationData
  const { education_id, ...updateData } = educationData;

  const setClause = Object.keys(updateData)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');

  // Ensure that placeholders match the number of parameters
  const placeholders = [...Array(Object.keys(updateData).length).keys()]
    .map(index => `$${index + 2}`)
    .join(', ');

  const queryText = `UPDATE education SET ${setClause} WHERE user_id = $1 AND education_id = $${Object.keys(updateData).length + 2}`;
  
  // Execute the query
  await query(queryText, [userId, ...Object.values(updateData), education_id]);
};



export default router;
