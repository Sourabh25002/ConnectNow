import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../utils/config";
import Header from "./Header";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend logout route
      await axios.post(
        backendUrl + "/auth/logout",
        {},
        {
          withCredentials: true, // Include cookies in the request
        }
      );

      // Clear all cookies from the browser
      document.cookie.split(";").forEach(function (cookie) {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT");
      });

      // Redirect the user to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error if needed
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center mt-24">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Logout;
