import React, { useState } from "react";
import { Like, Comment } from "../../public/Icons";

const Post: React.FC<{ post: any }> = ({ post }) => {
  const [expanded, setExpanded] = useState(false);

  // Function to truncate text to a certain number of words
  const truncateText = (text: string, maxLength: number) => {
    const words = text.split(" ");
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(" ") + "...";
    } else {
      return text;
    }
  };

  // Format date
  const formattedDate = new Date(post.date).toLocaleDateString();

  // Function to toggle between truncated and full content
  const toggleContent = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-md mb-4 mt-4">
      {/* User profile image and name */}
      <div className="flex items-center mb-2">
        <img
          src={post.user.profileImage}
          alt="Profile"
          className="w-14 h-14 rounded-full mr-2"
        />
        <div>
          <h2 className="text-lg">{post.user.userName}</h2>
          <p className="text-gray-500">
            {truncateText(post.user.headline, 10)}
          </p>
          {/* Date */}
          <p className="text-gray-500 mb-2">{formattedDate}</p>
        </div>
      </div>

      {/* Post content */}
      <p className="text-gray-300">
        {expanded ? post.content : truncateText(post.content, 40)}
      </p>

      {/* See more */}
      {post.content.length > 40 && (
        <button
          className="text-blue-500 hover:underline mt-2"
          onClick={toggleContent}
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}

      {/* Post image */}
      <img
        src={post.image}
        alt="Post"
        className="mt-4 mb-2 h-96 w-full object-cover"
      />

      {/* Full-width line */}
      <hr className="my-4 border-t border-gray-500" />

      {/* Like and comment options */}
      <div className="flex justify-between items-center">
        <button className="text-gray-300 flex items-center">
          <svg
            className="w-6 h-6 mr-1 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <Like />
          </svg>
          Like
        </button>
        <button className="text-gray-300 flex items-center">
          <svg
            className="w-6 h-6 mr-1 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <Comment />
          </svg>
          Comment
        </button>
      </div>
    </div>
  );
};

export default Post;
