import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Leftside: React.FC = () => {
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

  // console.log(profileDetails.userProfile.about_description);

  // Extracting the cover photo URL
  let coverPhotoUrl = "";
  if (profileDetails && profileDetails.userProfile.cover_photo_url) {
    const coverPhotoData = JSON.parse(
      profileDetails.userProfile.cover_photo_url
    );
    coverPhotoUrl = coverPhotoData.secure_url;
  }

  // Extracting the profile image URL
  let profileImageUrl = "";
  if (profileDetails && profileDetails.userProfile.profile_picture_url) {
    const profileImageData = JSON.parse(
      profileDetails.userProfile.profile_picture_url
    );
    profileImageUrl = profileImageData.secure_url;
  }

  return (
    <div className="rounded-lg bg-black text-white flex flex-col justify-center items-center md:max-w-full lg:max-w-64 xl:max-w-64 mx-auto mt-20">
      {/* Banner image */}
      <div className="w-full md:w-260 rounded-lg overflow-hidden">
        <img
          src={coverPhotoUrl}
          alt="Banner"
          className="w-full h-20 object-cover mb-4 rounded-tl-lg rounded-tr-lg"
        />
      </div>

      {/* Profile image */}
      <Link to="/profile">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full bg-white border-4 border-black mb-4 object-cover"
        />
      </Link>

      {/* User information */}
      <div className="text-center">
        <Link to="/profile">
          <h2 className="font-bold mb-6">
            {profileDetails && profileDetails.userProfile.first_name}{" "}
            {profileDetails && profileDetails.userProfile.last_name}
          </h2>
        </Link>
        <p className="mb-8 pl-4 pr-4">
          {profileDetails && profileDetails.userProfile.headline}
        </p>
        <p>
          Connections:{" "}
          {profileDetails && profileDetails.userProfile.connection_count}
        </p>
      </div>
      <div className="h-4"></div>
    </div>
  );
};

export default Leftside;
