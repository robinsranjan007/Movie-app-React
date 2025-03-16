import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import UpdateProfileInfo from "../myprofile/updateinfo/updateuserprofile";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/users/${userId}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => console.error("Error fetching user data:", error));
    }
  }, [userId]);

  const handleSave = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[400px] text-center">
        
        {/* Profile Header */}
        <h2 className="text-3xl font-bold mb-6 text-white-500">My Profile</h2>

        {/* Profile Icon with Camera Icon */}
        <div className="relative inline-block">
          <FaUserCircle size={128} className="mx-auto mb-4 text-gray-400" />

          {/* Camera Icon */}
          <div 
            className="absolute bottom-4 right-4 bg-gray-700 p-2 rounded-full text-white cursor-pointer hover:bg-gray-600 transition duration-200"
            title="Update Profile Picture"
            onClick={() => setIsModalOpen(true)}
          >
            <FaCamera size={18} />
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-3 text-gray-300 text-left">
          <p><span className="font-semibold text-white">Name:</span> {user.firstName} {user.lastName}</p>
          <p><span className="font-semibold text-white">Username:</span> {user.username}</p>
          <p><span className="font-semibold text-white">Email:</span> {user.email}</p>
          <p><span className="font-semibold text-white">Age:</span> {user.age}</p>
        </div>

        {/* Update Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition duration-300"
        >
          Update Profile
        </button>
      </div>

      {/* Modal to update profile */}
      {isModalOpen && (
        <UpdateProfileInfo
          user={user}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyProfile;
