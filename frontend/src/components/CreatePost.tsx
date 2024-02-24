import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backendUrl } from "../utils/config";
import axios from "axios";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMedia(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (media) {
        formData.append("media_link", media);
      }

      const response = await axios.post(backendUrl + "/post/posts", formData, {
        withCredentials: true, // Include cookies in the request
      });

      // If post created successfully, navigate to /home
      if (response.status === 201) {
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error if needed
    }
  };

  return (
    <div className="bg-black p-4 absolute top-20 left-20 right-20 bottom-20 rounded-lg">
      <Link to="/home" className="text-white mb-4 block">
        Back
      </Link>
      <h2 className="text-white text-2xl mb-6">Create New Post</h2>
      <div>
        <label className="text-white">Content:</label>
        <input
          type="text"
          placeholder="Enter text content"
          value={content}
          onChange={handleContentChange}
          className="w-full p-3 mb-4 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none"
        />
        <label className="text-white">Media:</label>
        <input
          type="file"
          accept="image/*, video/*"
          onChange={handleMediaChange}
          className="w-full p-3 mb-4 bg-gray-800 rounded-lg text-white focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
