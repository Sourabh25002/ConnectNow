import { Router, Request, Response } from 'express';
import authenticateMiddleware from '../middlewares/auth_middleware';
import query from '../db/database';
import { upload } from '../middlewares/multer_middleware';
import { uploadOnCloudinary } from '../utils/cloudinary_util';
import { verifyToken } from '../utils/jwt_util';
import { posts } from '../models/posts_model';

const router = Router();

// GET request to retrieve all posts of a particular user by user_id
router.get('/posts/:user_id',  authenticateMiddleware, async (req: Request, res: Response) => {
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

    // Extract user_id from request parameters
    const { user_id } = req.params;

    // Ensure the authenticated user matches the requested user_id
    if (decodedToken.user_id !== parseInt(user_id, 10)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Retrieve all posts of the specified user from the database
    const postsResult = await query('SELECT * FROM posts WHERE user_id = $1', [user_id]);

    // Send the retrieved posts in the response
    res.status(200).json({ posts: postsResult.rows });
  } catch (error: any) {
    console.error('Error while retrieving user posts:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to create a new post
router.post('/posts', 
  authenticateMiddleware, 
  upload.single('media_link'), // Assuming 'media_link' is the field name for the file
  async (req: Request, res: Response) => {
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

      // Check if both content and media_link are provided in the request body
      const { content }: posts = req.body;
      const media_link: string = req.file?.path || ''; // Assuming the file path is stored in req.file.path

      if (!content || !media_link) {
        return res.status(400).json({ error: 'Content and media link are required' });
      }

      // Extract the URL from the media link
      const mediaUrl = await uploadOnCloudinary(media_link);

      // Insert the post into the database
      const result = await query<posts>(
        'INSERT INTO posts (user_id, content, media_link) VALUES ($1, $2, $3) RETURNING *',
        [userId, content, mediaUrl]
      );

      // Respond with the created post
      res.status(201).json({ message: 'Post created successfully', post: result.rows[0] });
    } catch (error: any) {
      console.error('Error while creating post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);



router.put('/posts/:post_id', 
  authenticateMiddleware, 
  upload.single('media_link'), // Assuming 'media_link' is the field name for the file
  async (req: Request, res: Response) => {
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

      // Check if the post exists and if the authenticated user is the owner of the post
      const postResult = await query<posts>('SELECT * FROM posts WHERE post_id = $1', [postId]);
      if (postResult.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const post: posts = postResult.rows[0];
      if (post.user_id !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Check if any data is provided in the request body
      const { content }: posts = req.body;
      let media_link: string | undefined = post.media_link; // Default to the existing media link

      // Check if a file was uploaded
      if (req.file) {
        // Extract the URL from the media link
        const uploadedMedia = await uploadOnCloudinary(req.file.path);
        if (uploadedMedia !== null) {
          media_link = uploadedMedia.url; // Extracting URL from the UploadApiResponse object
        } else {
          // Handle case where uploadOnCloudinary returns null
          console.error('Failed to upload media to Cloudinary');
          // Optionally handle the error or fallback behavior
        }
      }


      // Update only the fields provided by the user
      const updates: any = {};
      if (content) updates.content = content;
      if (media_link) updates.media_link = media_link;

      // Update the post in the database
      const result = await query<posts>(
        'UPDATE posts SET content = COALESCE($1, content), media_link = COALESCE($2, media_link) WHERE post_id = $3 RETURNING *',
        [updates.content, updates.media_link, postId]
      );

      // Respond with the updated post
      res.status(200).json({ message: 'Post updated successfully', post: result.rows[0] });
    } catch (error: any) {
      console.error('Error while updating post:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);



// DELETE route to delete a post
router.delete('/posts/:post_id', authenticateMiddleware, async (req: Request, res: Response) => {
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

    // Check if the post exists and if the authenticated user is the owner of the post
    const postResult = await query<posts>('SELECT * FROM posts WHERE post_id = $1', [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post: posts = postResult.rows[0];
    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete the post from the posts table
    await query('DELETE FROM posts WHERE post_id = $1', [postId]);

    // Delete associated rows from post_likes and post_comments tables
    await query('DELETE FROM post_likes WHERE post_id = $1', [postId]);
    await query('DELETE FROM post_comments WHERE post_id = $1', [postId]);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Error while deleting post:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




export default router;
