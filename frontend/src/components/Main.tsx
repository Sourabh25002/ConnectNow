import { Media, Event, Article } from "../../public/Icons";
import React from "react";
import { Link } from "react-router-dom";

const Main: React.FC = () => {
  return (
    <div className="bg-black max-w-screen-sm mx-auto rounded-lg">
      <div className="container mx-auto mt-20 px-4">
        {/* Container for profile image and input field */}
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-5">
          {/* Profile image */}
          <img
            src="https://media.licdn.com/dms/image/D4D35AQHfvfYnc4MhLw/profile-framedphoto-shrink_200_200/0/1701438418638?e=1708261200&v=beta&t=0ZQP3Agl0ZZx-QT3f28UyDdKohXXrM_toIxkvu1mzUw"
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
            <Link to="/media" className="flex items-center text-white">
              <Media className="w-6 h-6 md:w-7 md:h-7" />
              <span className="ml-2">Media</span>
            </Link>

            <Link to="/event" className="flex items-center text-white">
              <Event className="w-6 h-6 md:w-7 md:h-7" />
              <span className="ml-2">Event</span>
            </Link>

            <Link to="/article" className="flex items-center text-white">
              <Article className="w-7 h-7 md:w-8 md:h-8" />
              <span className="ml-2">Article</span>
            </Link>
          </div>
        </div>

        {/* Space below icons */}
        <div className="bg-black h-6" />
      </div>
    </div>
  );
};

export default Main;
