import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, MyNetwork, Account, Message } from "../../public/Icons";
import { useMediaQuery } from "@react-hook/media-query"; // or use appropriate media query library

const Header: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)"); // Define your breakpoint here

  return (
    <header className="bg-black text-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto h-16 flex justify-between items-center py-4 px-4 md:px-8">
        {/* Logo */}
        <Link to="/home">
          <img src="/logoname1.png" alt="Logo" className="h-10" />
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-8">
          {!isMobile && ( // Conditionally render based on screen size
            <>
              <Link
                to="/home"
                className="flex flex-col items-center text-gray-600 hover:text-white"
              >
                <Home className="h-6 w-6 mb-1 mr-2" />{" "}
                {/* Add margin-right for spacing */}
                <span className="text-xs">Home</span>
              </Link>
              <Link
                to="/search"
                className="flex flex-col items-center text-gray-600 hover:text-white"
              >
                <Search className="h-6 w-6 mb-1 mr-2" />{" "}
                {/* Add margin-right for spacing */}
                <span className="text-xs">Search</span>
              </Link>
              <Link
                to="/mynetwork"
                className="flex flex-col items-center text-gray-600 hover:text-white"
              >
                <MyNetwork className="h-6 w-6 mb-1 mr-2" />{" "}
                {/* Add margin-right for spacing */}
                <span className="text-xs">My Network</span>
              </Link>
              <Link
                to="/messages"
                className="flex flex-col items-center text-gray-600 hover:text-white"
              >
                <Message className="h-6 w-6 mb-1 mr-2" />{" "}
                {/* Add margin-right for spacing */}
                <span className="text-xs">Messages</span>
              </Link>
              <Link
                to="/account"
                className="flex flex-col items-center text-gray-600 hover:text-white"
              >
                <Account className="h-6 w-6 mb-1 mr-2" />{" "}
                {/* Add margin-right for spacing */}
                <span className="text-xs">Account</span>
              </Link>
            </>
          )}
          {isMobile && ( // Only show icons on mobile screens
            <>
              <Link
                to="/home"
                className="flex items-center text-gray-600 hover:text-white"
              >
                <Home className="h-6 w-6" />
              </Link>
              <Link
                to="/search"
                className="flex items-center text-gray-600 hover:text-white"
              >
                <Search className="h-6 w-6" />
              </Link>
              <Link
                to="/mynetwork"
                className="flex items-center text-gray-600 hover:text-white"
              >
                <MyNetwork className="h-6 w-6" />
              </Link>
              <Link
                to="/messages"
                className="flex items-center text-gray-600 hover:text-white"
              >
                <Message className="h-6 w-6" />
              </Link>
              <Link
                to="/account"
                className="flex items-center text-gray-600 hover:text-white"
              >
                <Account className="h-6 w-6" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
