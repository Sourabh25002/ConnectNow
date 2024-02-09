import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../../public/logoname1.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // Make API call to authenticate user
      // Replace this with your actual authentication logic
      const response = await fetch("http://your-backend-api-url.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Login successful, handle the response accordingly
        console.log("Login successful");
      } else {
        // Handle login failure
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center">
      <img src={logo} alt="Logo" className="h-14 w-70 mb-4" />
      <div className="max-w-xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        {/* Login form */}
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
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full w-full mb-6"
            >
              LOG IN
            </button>
            <div className="border-b border-gray-300 mb-6"></div>
            <div className="text-lg mb-6">Don't have an account?</div>
            <Link to="/signup">
              <div className="border flex items-center justify-center py-4 rounded-full font-bold bg-blue-700 hover:bg-blue-600 w-full">
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
