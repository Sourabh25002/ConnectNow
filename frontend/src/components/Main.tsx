import React from "react";
import { Media, Event, Article } from "../../public/Icons";
import { Link } from "react-router-dom";
// import Post from "./Posts"; // Assuming the name of the post component is Post, not Posts
import { useState, useEffect } from "react";
import axios from "axios";
import PostFetcher from "./Posts";

const Main: React.FC = () => {
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
  // console.log(profileDetails.userProfile.first_name);

  // Extracting the profile image URL
  let profileImageUrl = "";
  if (profileDetails && profileDetails.userProfile.profile_picture_url) {
    const profileImageData = JSON.parse(
      profileDetails.userProfile.profile_picture_url
    );
    profileImageUrl = profileImageData.secure_url;
  }

  return (
    <>
      <div className="bg-black max-w-screen-sm mx-auto rounded-lg">
        <div className="container mx-auto mt-20 px-4">
          {/* Container for profile image and input field */}
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-5">
            {/* Profile image */}
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full bg-white"
            />

            {/* Input field for starting a post */}
            <input
              type="text"
              placeholder="Start a post"
              className="flex-1 px-4 py-2 bg-gray-200 rounded-full font-bold"
            />
          </div>

          {/* Icons row */}
          <div className="container mx-auto px-4 md:px-10 mt-3">
            <div className="flex justify-between items-center">
              <Link to="/createPost" className="flex items-center text-white">
                <Media className="w-6 h-6 md:w-7 md:h-7" />
                <span className="ml-2">Media</span>
              </Link>

              <Link to="/createPost" className="flex items-center text-white">
                <Event className="w-6 h-6 md:w-7 md:h-7" />
                <span className="ml-2">Event</span>
              </Link>

              <Link to="/createPost" className="flex items-center text-white">
                <Article className="w-7 h-7 md:w-8 md:h-8" />
                <span className="ml-2">Article</span>
              </Link>
            </div>
          </div>

          {/* Space below icons */}
          <div className="bg-black h-6" />
        </div>
      </div>
      <PostFetcher />{" "}
    </>
  );
};

export default Main;
