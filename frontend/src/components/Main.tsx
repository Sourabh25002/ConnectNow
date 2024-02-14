import React from "react";
import { Media, Event, Article } from "../../public/Icons";
import { Link } from "react-router-dom";
import Post from "./Posts"; // Assuming the name of the post component is Post, not Posts

const Main: React.FC = () => {
  // Sample post data (replace with actual data fetched from the backend)
  const postData = {
    user: {
      profileImage:
        "https://media.licdn.com/dms/image/D4D35AQHfvfYnc4MhLw/profile-framedphoto-shrink_200_200/0/1701438418638?e=1708261200&v=beta&t=0ZQP3Agl0ZZx-QT3f28UyDdKohXXrM_toIxkvu1mzUw",
      userName: "Sourabh Kumar",
      headline:
        "TCS CodeVita Season 11( Global Rank 527 ) | MERN Stack Developer | Web App Enthusiast | JavaScript | React | Node.js | Express.js | MongoDB | Embracing Emerging Technologies | Seeking Internship Opportunities",
    },
    date: new Date(),
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget commodo justo. Vestibulum id mi ac justo venenatis ullamcorper eget ut neque. 👋 Greetings! I'm Sourabh Kumar, a passionate computer science and engineering student at Rajkiya Engineering College Sonbhadra, Uttar Pradesh. My journey in the world of technology began with a spark, and I've been igniting it ever since. Graduating in 2024, I'm on a mission to shape the digital landscape with innovation and creativity. 🚀 What I Do: Full Stack Web Development is my forte, and I specialize in the dynamic MERN stack (MongoDB, Express, React, Node.js). Crafting interactive and user-centric web applications is where I thrive, transforming ideas into reality with lines of code.💼 Projects that Define Me:🎵 MeloTunes: Music player with user login, song control, playlists, artist search, song upload, and social sharing. Your musical journey, personalized.🌐 FriendVibes: Experience a comprehensive platform with features like liking, following, signing up, creating posts, and more, fostering seamless social interaction.📝 Blog Website: Creating a platform for sharing thoughts and insights, I engineered a blog website that bridges the gap between knowledge and expression.🔧 Tech Toolbox:MERN Stack: Harnessing the power of MongoDB, Express, React, and Node.js to architect seamless, robust, and feature-rich applications.Problem Solving: My logical thinking and analytical mindset enable me to dissect challenges and engineer effective solutions.",
    image:
      "https://images.unsplash.com/photo-1602108987428-4768d7c7ecbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eWVsbG93JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
  };

  return (
    <>
      <div className="bg-black max-w-screen-sm mx-auto rounded-lg">
        <div className="container mx-auto mt-20 px-4">
          {/* Container for profile image and input field */}
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-5">
            {/* Profile image */}
            <img
              src={postData.user.profileImage}
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
      <Post post={postData} />{" "}
      {/* Pass the postData object as a prop to Post */}
    </>
  );
};

export default Main;
