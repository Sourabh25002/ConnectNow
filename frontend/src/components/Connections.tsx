import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../utils/config";
import Header from "./Header";

// interface UserProfile {
//   user_profile_id: number;
//   user_id: number;
//   first_name: string | null;
//   last_name: string | null;
//   headline: string | null;
//   current_company: string | null;
//   highest_education: string | null;
//   country_of_residence: string | null;
//   residence: string | null;
//   email_address: string | null;
//   phone_number: string | null;
//   connection_count: number | null;
//   date_of_birth: string | null;
//   personal_website_link: string | null;
//   profile_picture_url: string | null;
//   cover_photo_url: string | null;
//   about_description: string | null;
// }

interface ConnectedUserCard {
  followedId: number;
}

interface NonConnectedUsersComponentProps {
  userId: number;
}

interface Connections {
  connection_id: number;
  follower_id: number;
  followed_id: number;
  created_at: string;
}

const ConnectedUsersComponent: React.FC = () => {
  const [connectedUsers, setConnectedUsers] = useState<Connections[]>([]);

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const response = await axios.get(backendUrl + "/follow/following", {
          withCredentials: true, // Include cookies in the request
        });
        setConnectedUsers(response.data.followedUsers);
      } catch (error) {
        console.error("Error fetching connected users:", error);
      }
    };

    fetchConnectedUsers();
  }, []);

  // console.log(connectedUsers);

  // const handleUnfollow = (userId: number) => {
  //   console.log(`Unfollowing user with ID ${userId}`);
  // };

  return (
    <div className="flex flex-wrap justify-center p-4">
      {connectedUsers.map((user) => (
        <ConnectedUserCard
          key={user.connection_id}
          followedId={user.followed_id}
        />
      ))}
    </div>
  );
};

const ConnectedUserCard: React.FC<ConnectedUserCard> = ({ followedId }) => {
  // const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/user/profile/${followedId}`
        ); // Replace '/backendRoute' with your actual backend route
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [followedId]);

  const handleUnfollow = async () => {
    try {
      await axios.delete(backendUrl + `/follow/connection/${followedId}`, {
        withCredentials: true,
      });
      setUserDetails(null);
      window.location.reload();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  // if (!userDetails) {
  //   return <div>Loading user details...</div>;
  // }

  // console.log(userDetails);

  // Extracting the cover photo URL
  let coverPhotoUrl = "";
  if (userDetails && userDetails.userProfile.cover_photo_url) {
    const coverPhotoData = JSON.parse(userDetails.userProfile.cover_photo_url);
    coverPhotoUrl = coverPhotoData.secure_url;
  }

  // Extracting the profile image URL
  let profileImageUrl = "";
  if (userDetails && userDetails.userProfile.profile_picture_url) {
    const profileImageData = JSON.parse(
      userDetails.userProfile.profile_picture_url
    );
    profileImageUrl = profileImageData.secure_url;
  }

  return (
    <div className="bg-black p-2 rounded-md border border-gray-600 m-2">
      {userDetails && userDetails.userProfile && (
        <div className="flex flex-col items-center">
          <img
            className="w-full max-w-xs rounded-t-md object-cover"
            src={coverPhotoUrl}
            alt="User Background"
          />
          <img
            className="w-16 h-16 rounded-full border-2 border-white -mt-8 object-cover"
            src={profileImageUrl}
            alt="User Profile"
          />
          <div className="text-white text-center mt-2">
            <h2 className="text-base font-bold">{`${userDetails.userProfile.first_name} ${userDetails.userProfile.last_name}`}</h2>
            <p className="text-xs">
              {userDetails.userProfile.headline
                .split(" ")
                .slice(0, 5)
                .join(" ")}
              {userDetails.userProfile.headline.split(" ").length > 5
                ? "..."
                : ""}
            </p>
            <button
              className="bg-lBlue hover:bg-blue-700 text-black px-2 py-1 rounded-md mt-1"
              onClick={handleUnfollow}
            >
              Unfollow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NonConnectedUsersComponent: React.FC = () => {
  const [nonConnectedUsers, setNonConnectedUsers] = useState<number[]>([]);

  useEffect(() => {
    const fetchNonConnectedUsers = async () => {
      try {
        const response = await axios.get(backendUrl + "/user/users/all", {
          withCredentials: true, // Include cookies in the request
        });
        // Assuming the response data is an array of user IDs
        setNonConnectedUsers(response.data.userIDs || []);
      } catch (error) {
        console.error("Error fetching non-connected users:", error);
      }
    };

    fetchNonConnectedUsers();
  }, []);

  // console.log(nonConnectedUsers);

  return (
    <div className="flex flex-wrap justify-center p-4">
      {nonConnectedUsers &&
        nonConnectedUsers.map((userId, index) => (
          <NonConnectedUserCard key={index} userId={userId} />
        ))}
    </div>
  );
};

const NonConnectedUserCard: React.FC<NonConnectedUsersComponentProps> = ({
  userId,
}) => {
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/user/profile/${userId}`
        ); // Replace '/backendRoute' with your actual backend route
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const Follow = async () => {
    try {
      await axios.post(
        backendUrl + `/follow/connection`,
        { followedId: userId }, // Pass userId as followedId in the request body
        { withCredentials: true }
      );
      setUserDetails(null);
      window.location.reload();
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // if (!userDetails) {
  //   return <div>Loading user details...</div>;
  // }

  // console.log(userDetails);

  // Extracting the cover photo URL
  let coverPhotoUrl = "";
  if (userDetails && userDetails.userProfile.cover_photo_url) {
    const coverPhotoData = JSON.parse(userDetails.userProfile.cover_photo_url);
    coverPhotoUrl = coverPhotoData.secure_url;
  }

  // Extracting the profile image URL
  let profileImageUrl = "";
  if (userDetails && userDetails.userProfile.profile_picture_url) {
    const profileImageData = JSON.parse(
      userDetails.userProfile.profile_picture_url
    );
    profileImageUrl = profileImageData.secure_url;
  }

  return (
    <div className="bg-black p-2 rounded-md border border-gray-600 m-2">
      {userDetails && userDetails.userProfile && (
        <div className="flex flex-col items-center">
          <img
            className="w-full max-w-xs rounded-t-md object-cover"
            src={coverPhotoUrl}
            alt="User Background"
          />
          <img
            className="w-16 h-16 rounded-full border-2 border-white -mt-8 object-cover"
            src={profileImageUrl}
            alt="User Profile"
          />
          <div className="text-white text-center mt-2">
            <h2 className="text-base font-bold">{`${userDetails.userProfile.first_name} ${userDetails.userProfile.last_name}`}</h2>
            <p className="text-xs">
              {userDetails.userProfile.headline
                .split(" ")
                .slice(0, 5)
                .join(" ")}
              {userDetails.userProfile.headline.split(" ").length > 5
                ? "..."
                : ""}
            </p>
            <button
              className="bg-lBlue hover:bg-blue-700 text-black px-2 py-1 rounded-md mt-1"
              onClick={Follow}
            >
              Follow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const YourPageComponent: React.FC = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-900 min-h-screen mt-10 p-8">
        <h1 className="text-white text-2xl font-bold mb-4">Connections</h1>
        <ConnectedUsersComponent />
        <h1 className="text-white text-2xl font-bold mt-8 mb-4">
          People you may know
        </h1>
        <NonConnectedUsersComponent />
      </div>
    </>
  );
};

export default YourPageComponent;
