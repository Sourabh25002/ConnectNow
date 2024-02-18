import { Router, Request, Response } from 'express';
import query from '../db/database';
import authenticateMiddleware from '../middlewares/auth_middleware';
import { verifyToken } from '../utils/jwt_util';

const router = Router();

// Route to like or unlike a post
router.post('/post/:post_id', authenticateMiddleware, async (req: Request, res: Response) => {
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
    const postId: number = parseInt(req.params.post_id);

    // Check if the post exists
    const postExists = await query('SELECT 1 FROM posts WHERE post_id = $1', [postId]);
    if (postExists.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user has already liked the post
    const existingLike = await query('SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    if (existingLike.rows.length > 0) {
      // If the user has already liked the post, delete the row
      await query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
      // Decrement the likes_count in the posts table
      await query('UPDATE posts SET likes_count = CASE WHEN likes_count = 1 THEN NULL ELSE likes_count - 1 END WHERE post_id = $1', [postId]);
      return res.status(200).json({ message: 'Post unliked successfully' });
    } else {
      // If the user has not liked the post, create the row
      await query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
      // Increment the likes_count in the posts table
      await query('UPDATE posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE post_id = $1', [postId]);
      return res.status(201).json({ message: 'Post liked successfully' });
    }
  } catch (error: any) {
    console.error('Error while liking post:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

