import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/logoname.png";
import axios from "axios";

const Login: React.FC = () => {
  // State variables for email, password, and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Hook for navigation
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation: Check if email and password are provided
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // Create form data object
      const formData = new FormData();
      formData.append("email_address", email);
      formData.append("password", password);

      // Make API call to authenticate user
      const response = await axios.post(
        "http://localhost:8001/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Login successful, navigate to home page
        const { userId, accessToken, refreshToken } = response.data;

        // Store tokens and user ID in browser cookies
        document.cookie = `accessToken=${accessToken}; secure; samesite=strict`;
        document.cookie = `refreshToken=${refreshToken}; secure; samesite=strict`;
        document.cookie = `user_id=${userId}; secure; samesite=strict`;

        navigate("/home");
      } else {
        // Handle login failure
        setError("Invalid email or password.");
      }
    } catch (error) {
      // Handle errors
      console.error("Error logging in:", error);
      setError("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center">
      {/* Logo */}
      <img src={logo} alt="Logo" className="h-14 w-70 mb-4" />

      {/* Login form */}
      <div className="max-w-xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        <div className="text-white">
          {/* Header */}
          <h1 className="text-4xl md:text-6xl mb-10">
            Discover what your <br /> network can do for you
          </h1>

          {/* Error message */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email input */}
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

            {/* Password input */}
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

            {/* Login button */}
            <button
              type="submit"
              className="bg-lBlue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full w-full mb-6"
            >
              LOG IN
            </button>

            {/* Horizontal line */}
            <div className="border-b border-gray-300 mb-6"></div>

            {/* Sign up link */}
            <div className="text-lg mb-6">Don't have an account?</div>
            <Link to="/signup">
              <div className="border flex items-center justify-center py-4 rounded-full font-bold bg-lBlue hover:bg-blue-700 w-full">
                SIGN UP FOR CONNECTNOW
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
