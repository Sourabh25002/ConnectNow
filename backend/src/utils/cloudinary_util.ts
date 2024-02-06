import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    // If the localFilePath is not provided, return null
    if (!localFilePath) return null;

    // Upload the file to Cloudinary using the promise returned by upload
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // File has been uploaded successfully
    console.log("File is uploaded on Cloudinary!", response.url);

    return response;
  } catch (error: any) {
    // Log the error message for better debugging
    console.error('Error uploading file to Cloudinary:', error.message);

    // Remove the locally saved temporary file if the upload operation failed
    fs.unlinkSync(localFilePath);

    return null;
  }
};

export { uploadOnCloudinary };
