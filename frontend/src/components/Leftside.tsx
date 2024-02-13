// import React from "react";

// const Leftside: React.FC = () => {
//   // Sample user data (replace with actual data fetched from the backend)
//   const userData = {
//     bannerImage:
//       "https://media.licdn.com/dms/image/D4D16AQHUA4mCT7rjQg/profile-displaybackgroundimage-shrink_350_1400/0/1692392178083?e=1713398400&v=beta&t=v-AurbF0kignHTvvhiB_Ov9o_pol3Y5JJC4Bc9gZUbI",
//     profileImage:
//       "https://media.licdn.com/dms/image/D4D35AQHfvfYnc4MhLw/profile-framedphoto-shrink_200_200/0/1701438418638?e=1708261200&v=beta&t=0ZQP3Agl0ZZx-QT3f28UyDdKohXXrM_toIxkvu1mzUw",
//     userName: "Sourabh Kumar",
//     headline:
//       "TCS CodeVita Season 11( Global Rank 527 ) | MERN Stack Developer | Web App Enthusiast | JavaScript | React | Node.js | Express.js | MongoDB | Embracing Emerging Technologies | Seeking Internship Opportunities",
//     connectionCount: 500, // Sample connection count
//   };

//   return (
//     <div
//       className="rounded-lg"
//       style={{
//         position: "fixed",
//         left: "360px",
//         top: "0",
//         width: "260px", // Default width for larger screens
//         backgroundColor: "black",
//         color: "white",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: "8px",
//         marginTop: "80px",
//       }}
//     >
//       {/* Banner image */}
//       <div className="w-full md:w-260 rounded-lg overflow-hidden">
//         <img
//           src={userData.bannerImage}
//           alt="Banner"
//           className="w-full h-20 object-cover mb-4 rounded-tl-lg rounded-tr-lg"
//         />
//       </div>

//       {/* Profile image */}
//       <img
//         src={userData.profileImage}
//         alt="Profile"
//         className="w-20 h-20 rounded-full bg-white border-4 border-black mb-4 object-cover"
//       />

//       {/* User information */}
//       <div className="text-center">
//         <h2 className="font-bold mb-2">{userData.userName}</h2>
//         <p className="mb-2 pl-4 pr-4">{userData.headline}</p>
//         <p>Connections: {userData.connectionCount}</p>
//       </div>
//       <div className="h-4"></div>
//     </div>
//   );
// };

// export default Leftside;

import React from "react";

const Leftside: React.FC = () => {
  // Sample user data (replace with actual data fetched from the backend)
  const userData = {
    bannerImage:
      "https://media.licdn.com/dms/image/D4D16AQHUA4mCT7rjQg/profile-displaybackgroundimage-shrink_350_1400/0/1692392178083?e=1713398400&v=beta&t=v-AurbF0kignHTvvhiB_Ov9o_pol3Y5JJC4Bc9gZUbI",
    profileImage:
      "https://media.licdn.com/dms/image/D4D35AQHfvfYnc4MhLw/profile-framedphoto-shrink_200_200/0/1701438418638?e=1708261200&v=beta&t=0ZQP3Agl0ZZx-QT3f28UyDdKohXXrM_toIxkvu1mzUw",
    userName: "Sourabh Kumar",
    headline:
      "TCS CodeVita Season 11( Global Rank 527 ) | MERN Stack Developer | Web App Enthusiast | JavaScript | React | Node.js | Express.js | MongoDB | Embracing Emerging Technologies | Seeking Internship Opportunities",
    connectionCount: 500, // Sample connection count
  };

  return (
    <div className="rounded-lg bg-black text-white flex flex-col justify-center items-center md:max-w-full lg:max-w-64 xl:max-w-64 mx-auto mt-20">
      {/* Banner image */}
      <div className="w-full md:w-260 rounded-lg overflow-hidden">
        <img
          src={userData.bannerImage}
          alt="Banner"
          className="w-full h-20 object-cover mb-4 rounded-tl-lg rounded-tr-lg"
        />
      </div>

      {/* Profile image */}
      <img
        src={userData.profileImage}
        alt="Profile"
        className="w-20 h-20 rounded-full bg-white border-4 border-black mb-4 object-cover"
      />

      {/* User information */}
      <div className="text-center">
        <h2 className="font-bold mb-6">{userData.userName}</h2>
        <p className="mb-8 pl-4 pr-4">{userData.headline}</p>
        <p>Connections: {userData.connectionCount}</p>
      </div>
      <div className="h-4"></div>
    </div>
  );
};

export default Leftside;
