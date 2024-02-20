import React, { useState, useEffect } from "react";
import { Like, Comment, Options } from "../../public/Icons";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
// import { PostContext } from "./PostContext";

// Function to get user_id from cookies
const getUserIDFromCookies = (): string | undefined => {
  // Get the user_id from cookies using the key you set while storing it
  return Cookies.get("user_id");
};

const Post: React.FC<{ post: any }> = ({ post }) => {
  // console.log(post);

  const [expanded, setExpanded] = useState(false);

  // State to manage the visibility of the options menu
  const [showOptions, setShowOptions] = useState(false);

  // State to store profile details
  const [profileDetails, setProfileDetails] = useState<any>(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        // Make GET request to fetch profile details
        const response = await axios.get(
          "http://localhost:8001/user/profile/details",
          {
            withCredentials: true, // Include cookies in the request
          }
        );

        // Set profile details in state
        setProfileDetails(response.data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, []); // Run only once when component mounts

  // Check if profileDetails is null before accessing its properties
  // console.log(profileDetails && profileDetails.userProfile.headline);

  // // Function to truncate text to a certain number of words
  const truncateText = (text: string, maxLength: number) => {
    const words = text.split(" ");
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(" ") + "...";
    } else {
      return text;
    }
  };

  // // Parse the created_at date
  // const createdAt = new Date(post.created_at);
  // // Format the date as a string
  // const formattedDate = createdAt.toLocaleString();
  // Parse the created_at date
  const createdAt = new Date(post.created_at);
  // Format the date as a string with the desired format
  const formattedDate = createdAt.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  // console.log(formattedDate);

  // Function to toggle between truncated and full content
  const toggleContent = () => {
    setExpanded(!expanded);
  };

  // Extracting the profile image URL
  let profileImageUrl = "";
  if (profileDetails && profileDetails.userProfile.profile_picture_url) {
    const profilePictureUrl = profileDetails.userProfile.profile_picture_url;
    // Check if profilePictureUrl is a string before parsing it
    if (typeof profilePictureUrl === "string") {
      const profileImageData = JSON.parse(profilePictureUrl);
      profileImageUrl = profileImageData.secure_url;
    }
  }

  let imageLink = "";
  if (post && post.media_link) {
    if (typeof post.media_link === "string") {
      try {
        // Attempt to parse post.media_link as JSON
        const profileImageData = JSON.parse(post.media_link);
        // Check if the parsed data has a secure_url property
        if (profileImageData.secure_url) {
          imageLink = profileImageData.secure_url;
        } else {
          // If secure_url is not present, fallback to the original media_link value
          imageLink = post.media_link;
        }
      } catch (error) {
        // If parsing fails, treat post.media_link as a direct URL
        imageLink = post.media_link;
      }
    } else {
      // If post.media_link is not a string, treat it as a direct URL
      imageLink = post.media_link;
    }
  }

  // Function to toggle the visibility of the options menu
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDeletePost = async () => {
    try {
      // Make DELETE request to delete the post
      const response = await axios.delete(
        `http://localhost:8001/post/posts/${post.post_id}`, // Use post_id in the URL
        {
          withCredentials: true, // Include cookies in the request
        }
      );

      // Check if the deletion was successful
      if (response.status === 200) {
        // Reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      // Handle error if needed
    }
  };

  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-md mb-4 mt-4 relative">
      {/* Render post content */}
      {/* <h2>{post.post_id}</h2>
      <h2>{post.user_id}</h2> */}

      {/* Options SVG */}
      <div className="absolute top-2 right-2">
        {/* Call toggleOptions function when Options SVG is clicked */}
        <Options
          className="w-6 h-6 fill-current text-gray-400 hover:text-gray-200 cursor-pointer"
          onClick={toggleOptions}
        />
      </div>

      {/* User profile image and name */}
      <div className="flex items-center mb-2">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-14 h-14 rounded-full mr-2"
        />
        <div>
          <h2 className="text-lg">
            {profileDetails && profileDetails.userProfile.first_name}{" "}
            {profileDetails && profileDetails.userProfile.last_name}
          </h2>
          <p className="text-gray-500">
            {profileDetails &&
              truncateText(profileDetails.userProfile.headline, 10)}
          </p>
          {/* Date */}
          <p className="text-gray-500 mb-2">{formattedDate}</p>
        </div>
      </div>

      {/* Post content */}
      <p className="text-gray-300">
        {expanded ? post.content : truncateText(post.content, 40)}
      </p>

      {/* Options dropdown menu */}
      {showOptions && (
        <div className="absolute top-10 right-2">
          <div className="bg-gray-800 text-white rounded-md shadow-md">
            <Link to={`/updatePost/${post.post_id}`}>
              <button className="block w-full text-left py-2 px-4 hover:bg-gray-700 focus:outline-none">
                Update Post
              </button>
            </Link>
            <button
              className="block w-full text-left py-2 px-4 hover:bg-gray-700 focus:outline-none"
              onClick={handleDeletePost}
            >
              Delete Post
            </button>
          </div>
        </div>
      )}

      {/* See more */}
      {post.content.length > 40 && (
        <button
          className="text-blue-500 hover:underline mt-2"
          onClick={toggleContent}
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}

      {/* Render post image if available */}

      <img
        src={imageLink}
        alt="Post"
        className="mt-4 mb-2 h-96 w-full object-cover"
      />

      {/* Full-width line */}
      <hr className="my-4 border-t border-gray-500" />

      {/* Render like and comment options */}
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

const PostFetcher: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Set loading state to true while fetching data
        setLoading(true);
        // Get user_id from cookies
        const userId = getUserIDFromCookies();
        if (!userId) {
          throw new Error("User ID not found in cookies");
        }
        // Fetch data from the backend using user_id
        const response = await axios.get(
          `http://localhost:8001/post/posts/${userId}`,
          {
            withCredentials: true, // Include cookies in the request
          }
        );
        // Check if response data contains posts
        if (!Array.isArray(response.data.posts)) {
          throw new Error("Posts data is not in the expected format");
        }
        // Set fetched data to the posts state
        setPosts(response.data.posts);
      } catch (error: any) {
        // If an error occurs, set error state
        setError("Error fetching posts: " + error.message);
      } finally {
        // Set loading state to false after fetching data
        setLoading(false);
      }
    };

    // Call the fetchPosts function when the component mounts
    fetchPosts();
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  // Render loading indicator if data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if there's an error fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the fetched posts
  return (
    <div>
      {posts.map(
        (
          post: any // Iterate over posts array
        ) => (
          <Post key={post.post_id} post={post} /> // Render Post component for each post
        )
      )}
    </div>
  );
};

export default PostFetcher;

{
  /*


const Post: React.FC<{ post: any }> = ({ post }) => {
  // console.log(post);
  const [expanded, setExpanded] = useState(false);

  // State to store profile details
  const [profileDetails, setProfileDetails] = useState<any>(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        // Make GET request to fetch profile details
        const response = await axios.get(
          "http://localhost:8001/user/profile/details",
          {
            withCredentials: true, // Include cookies in the request
          }
        );

        // Set profile details in state
        setProfileDetails(response.data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, []); // Run only once when component mounts

  // Check if profileDetails is null before accessing its properties
  // console.log(profileDetails && profileDetails.userProfile.headline);

  // // Function to truncate text to a certain number of words
  const truncateText = (text: string, maxLength: number) => {
    const words = text.split(" ");
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(" ") + "...";
    } else {
      return text;
    }
  };

  // // Parse the created_at date
  // const createdAt = new Date(post.created_at);
  // // Format the date as a string
  // const formattedDate = createdAt.toLocaleString();
  // Parse the created_at date
  const createdAt = new Date(post.created_at);
  // Format the date as a string with the desired format
  const formattedDate = createdAt.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  // console.log(formattedDate);

  // Function to toggle between truncated and full content
  const toggleContent = () => {
    setExpanded(!expanded);
  };

  // Extracting the profile image URL
  let profileImageUrl = "";
  if (profileDetails && profileDetails.userProfile.profile_picture_url) {
    const profileImageData = JSON.parse(
      profileDetails.userProfile.profile_picture_url
    );
    profileImageUrl = profileImageData.secure_url;
  }

  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-md mb-4 mt-4 relative">
      {/* Render post content */
}
{
  /* <h2>{post.post_id}</h2>
      <h2>{post.user_id}</h2> */
}

{
  /* User profile image and name */
}
{
  /*     <div className="flex items-center mb-2">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-14 h-14 rounded-full mr-2"
        />
        <div>
          <h2 className="text-lg">
            {profileDetails && profileDetails.userProfile.first_name}{" "}
            {profileDetails && profileDetails.userProfile.last_name}
          </h2>
          <p className="text-gray-500">
            {profileDetails &&
              truncateText(profileDetails.userProfile.headline, 10)}
          </p>
          {/* Date */
}
{
  /*          <p className="text-gray-500 mb-2">{formattedDate}</p>
        </div>
      </div>

      {/* Post content */
}
{
  /*     <p className="text-gray-300">
        {expanded ? post.content : truncateText(post.content, 40)}
      </p>

      {/* See more */
}
{
  /*    {post.content.length > 40 && (
        <button
          className="text-blue-500 hover:underline mt-2"
          onClick={toggleContent}
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}

      {/* Render post image if available */
}
{
  /*     {post.media_link && (
        <img
          src={JSON.parse(post.media_link).secure_url}
          alt="Post"
          className="mt-4 mb-2 h-96 w-full object-cover"
        />
      )}

      {/* Full-width line */
}
{
  /*     <hr className="my-4 border-t border-gray-500" />

      {/* Render like and comment options */
}
{
  /*     <div className="flex justify-between items-center">
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



*/
}
