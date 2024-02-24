import React from "react";
import { Pencil, College, Company } from "../../public/Icons";
import Header from "./Header";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../utils/config";

const Profile: React.FC = () => {
  // State to store profile details
  const [profileDetails, setProfileDetails] = useState<any>(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        // Make GET request to fetch profile details
        const response = await axios.get(backendUrl + `/user/profile/details`, {
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

  // console.log(profileDetails.about_description);

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

  // const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="bg-black text-white w-1/2 mx-auto mt-20 rounded-lg">
        {/* Banner image */}
        <Link to="/updateImages">
          <img
            src={coverPhotoUrl}
            alt="Banner"
            className="w-full h-44 object-cover rounded-tl-lg rounded-tr-lg mb-4"
          />
        </Link>

        <div className="px-4">
          {/* Edit profile icon */}
          <Link to="/profile/edit">
            {/* Adjusted outer div */}
            <div className="flex justify-end">
              <div className="">
                <button className="text-white hover:text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <Pencil />
                  </svg>
                </button>
              </div>
            </div>
          </Link>

          {/* Profile image */}
          <Link to="/updateImages">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full bg-white border-4 border-black mb-4 object-cover"
            />
          </Link>

          {/* User details */}
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold mb-2">
                {profileDetails && profileDetails.userProfile.first_name}{" "}
                {profileDetails && profileDetails.userProfile.last_name}
              </h1>
              <p className="text-base mb-4">
                {profileDetails && profileDetails.userProfile.headline}
              </p>
            </div>
            <div className="text-xs w-1/2">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <Company />
                </svg>
                <p className="font-bold mb-2 flex-grow">
                  {profileDetails && profileDetails.userProfile.current_company}
                </p>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <College />
                </svg>
                <p className="font-bold mb-2 flex-grow">
                  {profileDetails &&
                    profileDetails.userProfile.highest_education}
                </p>
              </div>
            </div>
          </div>

          <p className="mb-2">
            {profileDetails && profileDetails.userProfile.residence}
            {", "}
            {profileDetails && profileDetails.userProfile.country_of_residence}
          </p>
          <p className="mb-4">
            {profileDetails && profileDetails.userProfile.connection_count}{" "}
            connections
          </p>
          <div className="h-4"></div>
        </div>
      </div>
    </>
  );
};

export default Profile;
