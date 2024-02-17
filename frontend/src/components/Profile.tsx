import React from "react";
import { Pencil, College, Company } from "../../public/Icons";
import Header from "./Header";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Profile: React.FC = () => {
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

        // Log the profile details to console
        console.log("Profile Details:", response.data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, []); // Run only once when component mounts

  return (
    <>
      <Header />
      <div className="bg-black text-white w-1/2 mx-auto mt-20 rounded-lg">
        {/* Banner image */}
        <img
          src="https://media.licdn.com/dms/image/D4D16AQHUA4mCT7rjQg/profile-displaybackgroundimage-shrink_350_1400/0/1692392178083?e=1713398400&v=beta&t=v-AurbF0kignHTvvhiB_Ov9o_pol3Y5JJC4Bc9gZUbI"
          alt="Banner"
          className="w-full h-44 object-cover rounded-tl-lg rounded-tr-lg mb-4"
        />

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
          <img
            src="https://media.licdn.com/dms/image/D4D35AQHfvfYnc4MhLw/profile-framedphoto-shrink_200_200/0/1701438418638?e=1708261200&v=beta&t=0ZQP3Agl0ZZx-QT3f28UyDdKohXXrM_toIxkvu1mzUw"
            alt="Profile"
            className="w-24 h-24 rounded-full bg-white border-4 border-black mb-4 object-cover"
          />

          {/* User details */}
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold mb-2">Sourabh Kumar</h1>
              <p className="text-base mb-4">
                TCS CodeVita Season 11( Global Rank 527 ) | MERN Stack Developer
                | Web App Enthusiast | JavaScript | React | Node.js | Express.js
                | MongoDB | Embracing Emerging Technologies | Seeking Internship
                Opportunities
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
                <p className="font-bold mb-2 flex-grow">Harvard University</p>
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
                  Rajkiya Engineering College Sonbhadra
                </p>
              </div>
            </div>
          </div>

          <p className="mb-2">Boston, MA, United States</p>
          <p className="mb-4">500+ connections</p>
          <div className="h-4"></div>
        </div>
      </div>
    </>
  );
};

export default Profile;
