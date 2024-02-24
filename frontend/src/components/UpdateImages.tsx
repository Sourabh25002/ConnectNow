import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { backendUrl } from "../utils/config";

const UpdateImages: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (profileImage) formData.append("profile_picture", profileImage);
      if (coverImage) formData.append("cover_photo", coverImage);

      const response = await axios.post(
        backendUrl + "/user/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Cookie: document.cookie, // Include cookies in the request headers
          },
          withCredentials: true, // Enable sending cookies cross-origin
        }
      );

      console.log(response.data);
      // Handle success response
      navigate("/profile"); // Redirect to the /profile page after successful submission
    } catch (error) {
      console.error("Error updating images:", error);
      // Handle error
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
      <Link to="/profile" className="absolute top-4 left-4 text-white">
        Back
      </Link>
      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium"
            >
              Profile Picture
            </label>
            <div className="mt-1 flex items-center">
              <input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="coverPhoto" className="block text-sm font-medium">
              Cover Photo
            </label>
            <div className="mt-1 flex items-center">
              <input
                id="coverPhoto"
                name="coverPhoto"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Images
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateImages;
