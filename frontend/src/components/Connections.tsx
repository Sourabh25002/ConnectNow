import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../utils/config";

interface UserProfile {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  profileImageUrl: string | null;
  bannerImageUrl: string | null;
}

const ConnectedUsersComponent: React.FC = () => {
  const [connectedUsers, setConnectedUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const response = await axios.get(backendUrl + "/follow/following");
        setConnectedUsers(response.data.connectedUsers);
      } catch (error) {
        console.error("Error fetching connected users:", error);
      }
    };

    fetchConnectedUsers();
  }, []);

  const handleUnfollow = (userId: number) => {
    console.log(`Unfollowing user with ID ${userId}`);
  };

  return (
    <div>
      <h2 className="text-white text-2xl mb-4">Connected Users</h2>
      {connectedUsers.length > 0 ? (
        connectedUsers.map((user) => (
          <div key={user.userId} className="bg-black p-4 mb-4">
            {user.bannerImageUrl && (
              <img
                src={user.bannerImageUrl}
                alt="Banner"
                className="w-full mb-2"
              />
            )}
            {user.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full mb-2"
              />
            )}
            <div className="text-white mb-2">
              <h3 className="text-lg">
                {user.firstName || ""} {user.lastName || ""}
              </h3>
              <p className="text-gray-400">{user.headline || ""}</p>
            </div>
            <button
              onClick={() => handleUnfollow(user.userId)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Unfollow
            </button>
          </div>
        ))
      ) : (
        <p className="text-white">No connected users found.</p>
      )}
    </div>
  );
};

const NonConnectedUsersComponent: React.FC = () => {
  const [nonConnectedUsers, setNonConnectedUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchNonConnectedUsers = async () => {
      try {
        const response = await axios.get(backendUrl + "/user/users/all");
        setNonConnectedUsers(response.data.nonConnectedUsers);
      } catch (error) {
        console.error("Error fetching non-connected users:", error);
      }
    };

    fetchNonConnectedUsers();
  }, []);

  const handleFollow = (userId: number) => {
    console.log(`Following user with ID ${userId}`);
  };

  return (
    <div>
      <h2 className="text-white text-2xl mb-4">Non-Connected Users</h2>
      {nonConnectedUsers.length > 0 ? (
        nonConnectedUsers.map((user) => (
          <div key={user.userId} className="bg-black p-4 mb-4">
            {user.bannerImageUrl && (
              <img
                src={user.bannerImageUrl}
                alt="Banner"
                className="w-full mb-2"
              />
            )}
            {user.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full mb-2"
              />
            )}
            <div className="text-white mb-2">
              <h3 className="text-lg">
                {user.firstName || ""} {user.lastName || ""}
              </h3>
              <p className="text-gray-400">{user.headline || ""}</p>
            </div>
            <button
              onClick={() => handleFollow(user.userId)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Follow
            </button>
          </div>
        ))
      ) : (
        <p className="text-white">No non-connected users found.</p>
      )}
    </div>
  );
};

const YourPageComponent: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <ConnectedUsersComponent />
      <NonConnectedUsersComponent />
    </div>
  );
};

export default YourPageComponent;
