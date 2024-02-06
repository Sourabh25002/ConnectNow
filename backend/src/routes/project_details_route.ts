import { Router, Request, Response } from 'express';
import authenticateMiddleware from '../middlewares/auth_middleware';
import query from '../db/database';
import { verifyToken } from '../utils/jwt_util';
import { project_details } from '../models/project_details_model';
import { users_account } from '../models/users_account_model';

declare module 'express' {
  interface Request {
    newAccessToken?: string;
    user?: users_account;
  }
}

const router = Router();

// Route to get user project details
router.get('/projects', authenticateMiddleware, async (req: Request, res: Response) => {
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

    // Retrieve all project details for the authenticated user
    const projectDetailsResult = await query<project_details>('SELECT * FROM project_details WHERE user_id = $1', [userId]);

    res.status(200).json({ projectDetails: projectDetailsResult.rows });
  } catch (error: any) {
    console.error('Error while retrieving project details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create or update user project details
router.post('/projects', authenticateMiddleware, async (req: Request, res: Response) => {
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

    // Create or update project details entry
    if (req.body.project_detail_id) {
      await updateProjectDetails(userId, req.body);
      res.status(200).json({ message: 'Project details updated successfully' });
    } else {
      await createProjectDetails(userId, req.body);
      res.status(201).json({ message: 'Project details created successfully' });
    }
  } catch (error: any) {
    console.error('Error while storing/updating project details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a specific project entry
router.delete('/projects/:projectId', authenticateMiddleware, async (req: Request, res: Response) => {
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
    const projectId: number = parseInt(req.params.projectId, 10);

    // Check if the project entry exists for the authenticated user
    const existingProjectResult = await query<project_details>('SELECT * FROM project_details WHERE user_id = $1 AND project_detail_id = $2', [userId, projectId]);

    if (existingProjectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project entry not found' });
    }

    // Delete the project entry
    await query('DELETE FROM project_details WHERE user_id = $1 AND project_detail_id = $2', [userId, projectId]);

    res.status(200).json({ message: 'Project entry deleted successfully' });
  } catch (error: any) {
    console.error('Error while deleting project entry:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to create a new project details entry
const createProjectDetails = async (userId: number, projectData: Partial<project_details>) => {
  const columns = Object.keys(projectData);
  const values = Object.values(projectData);

  const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
  const queryText = `INSERT INTO project_details (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;

  await query(queryText, [userId, ...values]);
};

// Helper function to update an existing project details entry
const updateProjectDetails = async (userId: number, projectData: Partial<project_details>) => {
  // Exclude project_detail_id from the update operation
  const { project_detail_id, ...updateData } = projectData;

  const setClause = Object.keys(updateData)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');

  const queryText = `UPDATE project_details SET ${setClause} WHERE user_id = $1 AND project_detail_id = $${Object.keys(updateData).length + 2}`;

  await query(queryText, [userId, project_detail_id, ...Object.values(updateData)]);
};

export default router;
