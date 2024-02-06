import { Router, Request, Response } from 'express';
import authenticateMiddleware from '../middlewares/auth_middleware';
import query from '../db/database';
import { upload } from '../middlewares/multer_middleware';
import { uploadOnCloudinary } from '../utils/cloudinary_util';
import { verifyToken } from '../utils/jwt_util';
import { users_profile } from '../models/users_profile_model';
import { users_account } from '../models/users_account_model';

// Extend the Request interface to include custom properties
declare module 'express' {
  interface Request {
    newAccessToken?: string;
    user?: users_account;
  }
}

const router = Router();

// Route to retrieve user profile data
router.get('/profile/details', authenticateMiddleware, async (req: Request, res: Response) => {
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

    // Retrieve user profile data from the database
    const userProfileResult = await query<users_profile>('SELECT * FROM users_profile WHERE user_id = $1', [userId]);

    if (userProfileResult.rows.length > 0) {
      // User profile exists, send the data in the response
      const userProfileData = userProfileResult.rows[0];
      res.status(200).json({ userProfile: userProfileData });
    } else {
      // User profile doesn't exist, send a not found response
      res.status(404).json({ error: 'User profile not found' });
    }
  } catch (error: any) {
    console.error('Error while retrieving user profile:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to store or update user profile data
router.post('/profile', 
  authenticateMiddleware, 
  upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 }
  ]), 
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

      // Check if the user profile already exists
      const existingProfileResult = await query<users_profile>('SELECT * FROM users_profile WHERE user_id = $1', [userId]);

      // Handle uploading images to Cloudinary and updating database
      if (req.files && typeof req.files === 'object') {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Check if 'profile_picture' field exists and get the file path
        const profilePictureFilePath = (files['profile_picture'] && files['profile_picture'][0]?.path) || null;

        // Check if 'cover_photo' field exists and get the file path
        const coverPhotoFilePath = (files['cover_photo'] && files['cover_photo'][0]?.path) || null;

        // Upload images to Cloudinary
        const profilePictureUrl = profilePictureFilePath ? await uploadOnCloudinary(profilePictureFilePath) : (existingProfileResult.rows[0]?.profile_picture_url || null);
        const coverPhotoUrl = coverPhotoFilePath ? await uploadOnCloudinary(coverPhotoFilePath) : (existingProfileResult.rows[0]?.cover_photo_url || null);

        // Update the user profile data in the database
        if (existingProfileResult.rows.length > 0) {
          // User profile already exists, update the data including image URLs
          await updateProfile(userId, { ...req.body, profile_picture_url: profilePictureUrl, cover_photo_url: coverPhotoUrl });
          res.status(200).json({ message: 'User profile updated successfully' });
        } else {
          // User profile doesn't exist, create a new profile including image URLs
          await createProfile(userId, { ...req.body, profile_picture_url: profilePictureUrl, cover_photo_url: coverPhotoUrl });
          res.status(201).json({ message: 'User profile created successfully' });
        }
      } else {
        // If no files were uploaded, update the user profile data without images
        if (existingProfileResult.rows.length > 0) {
          // User profile already exists, update the data without images
          await updateProfile(userId, req.body);
          res.status(200).json({ message: 'User profile updated successfully' });
        } else {
          // User profile doesn't exist, create a new profile without images
          await createProfile(userId, req.body);
          res.status(201).json({ message: 'User profile created successfully' });
        }
      }
    } catch (error: any) {
      console.error('Error while storing/updating user profile:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);  

// Helper function to create a new user profile
const createProfile = async (userId: number, profileData: Partial<users_profile>) => {
  const columns = Object.keys(profileData);
  const values = Object.values(profileData);
  
  const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
  const queryText = `INSERT INTO users_profile (user_id, ${columns.join(', ')}) VALUES ($1, ${placeholders})`;

  await query(queryText, [userId, ...values]);
};

// Helper function to update an existing user profile
const updateProfile = async (userId: number, profileData: Partial<users_profile>) => {
  const setClause = Object.keys(profileData)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');

  const queryText = `UPDATE users_profile SET ${setClause} WHERE user_id = $1`;
  await query(queryText, [userId, ...Object.values(profileData)]);
};

export default router;