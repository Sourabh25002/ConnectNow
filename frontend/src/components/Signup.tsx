import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logoname.png";
import axios from "axios";
import { backendUrl } from "../utils/config";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Hook for navigation
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("email_address", email);
      formData.append("password", password);

      // Make API call to sign up user
      const response = await axios.post(backendUrl + "/auth/signUp", formData);

      // Handle successful sign-up
      if (response.status === 201) {
        // Extract user ID, access token, and refresh token from the response
        const { userId, accessToken, refreshToken } = response.data;

        // Store tokens and user ID in browser cookies
        document.cookie = `accessToken=${accessToken}; secure; samesite=strict`;
        document.cookie = `refreshToken=${refreshToken}; secure; samesite=strict`;
        document.cookie = `user_id=${userId}; secure; samesite=strict`;

        // Redirect to home page
        navigate("/home");
      } else {
        // Handle sign-up failure
        setError("Sign-up failed. Please try again later.");
      }
    } catch (error) {
      // Handle errors
      console.error("Error signing up:", error);
      setError("An error occurred while signing up. Please try again later.");
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center">
      <img src={logo} alt="Logo" className="h-14 w-70 mb-4" />
      <div className="max-w-xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        {/* Sign-up form */}
        <div className="text-white">
          <h1 className="text-4xl md:text-6xl mb-10">
            Discover what your <br /> network can do for you
          </h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="p-3 border border-gray-400 rounded w-full text-black placeholder-gray-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="p-3 border border-gray-400 rounded w-full text-black placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="bg-lBlue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full w-full mb-6"
            >
              SIGN UP
            </button>
            <div className="border-b border-gray-300 mb-6"></div>
            <div className="text-lg mb-6">Already have an account?</div>
            <Link to="/">
              <div className="border flex items-center justify-center py-4 rounded-full font-bold bg-lBlue hover:bg-blue-700 w-full">
                LOG IN INSTEAD
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
