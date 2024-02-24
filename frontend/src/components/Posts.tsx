import React, { useState, useEffect } from "react";
import { Like, Comment, Options } from "../../public/Icons";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { backendUrl } from "../utils/config";

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
        const response = await axios.get(backendUrl + "/user/profile/details", {
          withCredentials: true, // Include cookies in the request
        });

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
    if (!text) return ""; // Return empty string if text is null or undefined
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
        backendUrl + `/post/posts/${post.post_id}`, // Use post_id in the URL
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

  const handleLike = async () => {
    try {
      const response = await axios.post(
        backendUrl + `/like/post/${post.post_id}`,
        {},
        {
          withCredentials: true,
        }
      );
      window.location.reload();
      console.log(response.status);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const [showComments, setShowComments] = useState(false); // State to control visibility of Comments component

  const toggleComments = () => {
    setShowComments(!showComments); // Toggle the visibility of Comments component
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
        <button
          className="text-gray-300 flex items-center"
          onClick={handleLike}
        >
          <svg
            className="w-6 h-6 mr-1 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <Like />
          </svg>
          Like {post.likes_count}
        </button>
        <button
          className="text-gray-300 flex items-center mb-2"
          onClick={toggleComments} // Call toggleComments function when the button is clicked
        >
          <svg
            className="w-6 h-6 mr-1 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <Comment />
          </svg>
          Comment {post.comments_count}
        </button>
      </div>
      {showComments && <Comments post={post} />}
    </div>
  );
};

const Comments: React.FC<{ post: any }> = ({ post }) => {
  const [comment, setComment] = useState<string>("");

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handlePostComment = () => {
    // Prepare the comment data
    const commentData = {
      text_content: comment,
    };

    // Send the comment data to the backend route using Axios
    axios
      .post(backendUrl + `/comment/post/${post.post_id}`, commentData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include cookies
      })
      .then((response) => {
        console.log(response.data); // Log the response from the backend
        // Optionally, you can handle success response here
        setComment("");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error posting comment:", error.message);
        // Optionally, you can handle error here
      });
  };

  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments related to the post from backend server
        const response = await axios.get(
          backendUrl + `/comment/post/${post.post_id}`,
          { withCredentials: true }
        );

        // Set the fetched comments in the state
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    // Call the function to fetch comments when the component renders
    fetchComments();
  }, [post.post_id]);

  return (
    <div>
      {/* Full-width line */} <hr className="my-4 border-t border-gray-500" />
      <div className="bg-black p-4">
        <input
          type="text"
          placeholder="Write your comment..."
          value={comment}
          onChange={handleCommentChange}
          className="w-full p-2 mb-4 bg-gray-200 text-black"
        />
        <button
          onClick={handlePostComment}
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          Post
        </button>
      </div>
      {comments.map((comment, index) => (
        <UserComment key={index} comment={comment} /> // Pass comment as post prop
      ))}
    </div>
  );
};

const UserComment: React.FC<{ comment: any }> = ({ comment }) => {
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [deleted, setDeleted] = useState(false); // State variable to trigger re-render

  const userId = getUserIDFromCookies();

  const handleDeleteComment = async () => {
    try {
      await axios.delete(
        backendUrl +
          `/comment/post/${comment.post_id}/${comment.post_comment_id}`,
        { withCredentials: true }
      );
      // Implement any UI update or action after successfully deleting the comment
      setDeleted(true); // Set deleted to true upon successful deletion
      window.location.reload();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleDeleteOption = () => {
    setShowDeleteOption(!showDeleteOption);
  };

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/user/profile/${comment.user_id}`,
          {
            withCredentials: true,
          }
        );
        setProfileDetails(response.data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };
    fetchProfileDetails();
  }, [deleted]); // Trigger fetchProfileDetails on initial render and after successful deletion

  let profileImageUrl = "";
  if (profileDetails && profileDetails.userProfile.profile_picture_url) {
    const profileImageData = JSON.parse(
      profileDetails.userProfile.profile_picture_url
    );
    profileImageUrl = profileImageData.secure_url;
  }

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #333",
        padding: "8px",
        borderRadius: "8px",
      }}
      className="mb-4"
    >
      <div className="flex items-start space-x-4">
        <img
          src={profileImageUrl}
          alt="User Profile"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-grow">
          <div className="flex items-center">
            <h3 className="font-semibold">
              {profileDetails && profileDetails.userProfile.first_name}{" "}
              {profileDetails && profileDetails.userProfile.last_name}
            </h3>

            {userId == comment.user_id && (
              <div className="ml-auto p-2 relative">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 fill-current text-gray-400 hover:text-gray-200 cursor-pointer"
                    viewBox="0 0 24 24"
                    onClick={toggleDeleteOption}
                  >
                    <Options />
                  </svg>
                  {showDeleteOption && (
                    <button
                      className="absolute top-8 right-8 bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={handleDeleteComment}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-600">{comment.text_content}</p>
        </div>
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
        const response = await axios.get(backendUrl + `/post/posts/${userId}`, {
          withCredentials: true, // Include cookies in the request
        });
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

// const Comments: React.FC<{ post: any }> = ({ post }) => {
//   const [commentText, setCommentText] = useState("");
//   const [profileDetails, setProfileDetails] = useState<any>(null);
//   const [comments, setComments] = useState<any[]>([])

//   const handleCommentSubmit = async () => {
//     try {
//       // Send comment to backend server
//       const response = await axios.post(
//         `http://localhost:8001/comment/post/${post.post_id}`,
//         { text: commentText },
//         { withCredentials: true }
//       );

//       // Handle response or update UI if necessary
//       console.log("Comment posted:", response.data);

//       // Clear input after posting comment
//       setCommentText("");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchProfileDetails = async () => {
//       try {
//         // Make GET request to fetch profile details
//         const response = await axios.get(
//           `http://localhost:8001/user/profile/${post.user_id}`,
//           {
//             withCredentials: true, // Include cookies in the request
//           }
//         );

//         // Set profile details in state
//         setProfileDetails(response.data);
//       } catch (error) {
//         console.error("Error fetching profile details:", error);
//       }
//     };

//     fetchProfileDetails();
//   }, []); // Run only once when component mounts

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         // Make GET request to fetch profile details
//         const response = await axios.get(
//           `http://localhost:8001/post/${post.post_id}`,
//           {
//             withCredentials: true, // Include cookies in the request
//           }
//         );

//         setComments(response.data);
//       } catch (error) {
//         console.error("Error fetching comments:", error);
//       }
//     };

//     fetchComments();
//   }, []); // Run only once when component mounts

//   // Extracting the profile image URL
//   let profileImageUrl = "";
//   if (profileDetails && profileDetails.userProfile.profile_picture_url) {
//     const profileImageData = JSON.parse(
//       profileDetails.userProfile.profile_picture_url
//     );
//     profileImageUrl = profileImageData.secure_url;
//   }

//   return (
//     <>
//       {/* Full-width line */}
//       <hr className="my-4 border-t border-gray-500" />
//       <div className="bg-gray-200 p-4 rounded-lg mb-4">
//         <div className="border-b border-gray-400 mb-4"></div>
//         {/* Full-width line */}

//         {/* Comment input */}
//         <div className="flex mb-2">
//           <input
//             type="text"
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//             className="flex-grow p-2 border border-gray-400 rounded-md mr-2"
//             placeholder="Write a comment..."
//           />
//           <button
//             onClick={handleCommentSubmit}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//           >
//             Post
//           </button>
//         </div>

//         {/* User profile image and name */}
//         <div className="flex items-center mb-2">
//           <img src={profileImageUrl} className="w-10 h-10 rounded-full mr-2" />
//           <div>
//             <h2 className="font-bold">
//               {profileDetails && profileDetails.userProfile.first_name}{" "}
//               {profileDetails && profileDetails.userProfile.last_name}
//             </h2>
//           </div>
//         </div>

//         {/* Comment text */}
//         <p className="text-gray-800">{commentText}</p>
//       </div>
//     </>
//   );
// };

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
