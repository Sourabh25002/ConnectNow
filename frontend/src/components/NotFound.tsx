import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-xl mb-4">Working on this feature</p>
      <img
        src="https://media.istockphoto.com/id/924508948/photo/classic-highway-scene-in-the-american-west.webp?b=1&s=170667a&w=0&k=20&c=aIz3rSrwcA6jgSjF1eUABSMl2lr_4_6_Ft1HNxQQxag=" // Replace with the path to your 404 image
        alt="Page not found"
        className="w-80 h-80 mb-4"
      />
      <Link to="/home" className="text-blue-500 hover:underline">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
