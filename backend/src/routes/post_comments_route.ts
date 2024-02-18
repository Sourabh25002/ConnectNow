import { Router, Request, Response } from 'express';
import query from '../db/database';
import authenticateMiddleware from '../middlewares/auth_middleware';
import { verifyToken } from '../utils/jwt_util';
import { upload } from '../middlewares/multer_middleware';

const router = Router();

// Route to retrieve all comments related to a specific post_id
router.get('/post/:post_id', async (req: Request, res: Response) => {
  try {
    const postId: number = parseInt(req.params.post_id);

    // Retrieve all comments for the specified post_id
    const comments = await query('SELECT * FROM post_comments WHERE post_id = $1', [postId]);

    return res.status(200).json(comments.rows);
  } catch (error: any) {
    console.error('Error while retrieving comments:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create or update a comment on a post
router.post('/post/:post_id', authenticateMiddleware, upload.none(), async (req: Request, res: Response) => {
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
    const textContent: string = req.body.text_content; // Assuming the text content is provided in the request body

    // Check if the post exists
    const postExists = await query('SELECT 1 FROM posts WHERE post_id = $1', [postId]);
    if (postExists.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user has already commented on the post
    const existingComment = await query('SELECT post_comment_id FROM post_comments WHERE post_id = $1 AND user_id = $2', [postId, userId]);
    if (existingComment.rows.length > 0) {
      // If the user has already commented on the post, update the existing comment
      const commentId = existingComment.rows[0].post_comment_id;
      await query('UPDATE post_comments SET text_content = $1 WHERE post_comment_id = $2', [textContent, commentId]);
      return res.status(200).json({ message: 'Comment updated successfully' });
    } else {
      // If the user has not commented on the post, create a new comment
      await query('INSERT INTO post_comments (post_id, user_id, text_content) VALUES ($1, $2, $3)', [postId, userId, textContent]);

      // Increment the comments_count in the posts table or set it to 1 if it's null
      await query('UPDATE posts SET comments_count = COALESCE(comments_count, 0) + 1 WHERE post_id = $1', [postId]);

      return res.status(201).json({ message: 'Comment created successfully' });
    }
  } catch (error: any) {
    console.error('Error while creating or updating comment:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a comment on a post
router.delete('/post/:post_id/:comment_id', authenticateMiddleware, async (req: Request, res: Response) => {
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
    const commentId: number = parseInt(req.params.comment_id);

    // Check if the comment exists
    const commentExists = await query('SELECT 1 FROM post_comments WHERE post_comment_id = $1 AND post_id = $2', [commentId, postId]);
    if (commentExists.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the user is authorized to delete the comment
    const authorizedToDelete = await query('SELECT 1 FROM post_comments WHERE post_comment_id = $1 AND user_id = $2', [commentId, userId]);
    if (authorizedToDelete.rows.length === 0) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    // Delete the comment
    await query('DELETE FROM post_comments WHERE post_comment_id = $1', [commentId]);

    // Decrement the comments_count in the posts table
    await query('UPDATE posts SET comments_count = CASE WHEN comments_count > 1 THEN comments_count - 1 ELSE NULL END WHERE post_id = $1', [postId]);

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Error while deleting comment:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
