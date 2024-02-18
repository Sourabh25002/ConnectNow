import { Router, Request, Response } from 'express';
import authenticateMiddleware from '../middlewares/auth_middleware';
import { verifyToken } from '../utils/jwt_util';
import query from '../db/database';
import { Connection } from '../models/connections_model';

const router = Router();

// Route to get all followed users for a particular user
router.get('/following', authenticateMiddleware, async (req: Request, res: Response) => {
  try {
    const accessToken = req.newAccessToken || req.cookies.accessToken;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;

    const decodedToken = verifyToken(accessToken, accessSecret);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId: number = decodedToken.user_id;

    // Retrieve all users followed by the particular user
    const followedUsersResult = await query<Connection>('SELECT * FROM connections WHERE follower_id = $1', [userId]);

    res.status(200).json({ followedUsers: followedUsersResult.rows });
  } catch (error: any) {
    console.error('Error while retrieving followed users:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to create a new connection
router.post('/connection', authenticateMiddleware, async (req: Request, res: Response) => {
  try {
    const accessToken = req.newAccessToken || req.cookies.accessToken;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;

    const decodedToken = verifyToken(accessToken, accessSecret);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const followerId: number = decodedToken.user_id;
    const { followedId }: { followedId: number } = req.body;

    // Check if followedId exists
    const followedExistsResult = await query('SELECT * FROM users_account WHERE user_id = $1', [followedId]);
    if (followedExistsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Followed user not found' });
    }

    // Check if the connection already exists
    const connectionExistsResult = await query<Connection>('SELECT * FROM connections WHERE follower_id = $1 AND followed_id = $2', [followerId, followedId]);
    if (connectionExistsResult.rows.length > 0) {
      return res.status(400).json({ error: 'Connection already exists' });
    }

    // Insert the new connection
    await query('INSERT INTO connections (follower_id, followed_id) VALUES ($1, $2)', [followerId, followedId]);

    res.status(201).json({ message: 'Connection created successfully' });
  } catch (error: any) {
    console.error('Error while creating connection:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to unfollow a user
router.delete('/connection/:followedId', authenticateMiddleware, async (req: Request, res: Response) => {
  try {
    const accessToken = req.newAccessToken || req.cookies.accessToken;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;

    const decodedToken = verifyToken(accessToken, accessSecret);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const followerId: number = decodedToken.user_id;
    const followedId: number = parseInt(req.params.followedId, 10); // Use followedId from route params

    // Check if the connection exists
    const connectionExistsResult = await query<Connection>('SELECT * FROM connections WHERE follower_id = $1 AND followed_id = $2', [followerId, followedId]);
    if (connectionExistsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    // Delete the connection
    await query('DELETE FROM connections WHERE follower_id = $1 AND followed_id = $2', [followerId, followedId]);

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error: any) {
    console.error('Error while unfollowing:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;
