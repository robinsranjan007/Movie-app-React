import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaCamera } from "react-icons/fa";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/users/${userId}`)
        .then(response => {
          setUser(response.data);
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setAge(response.data.age);
          setEmail(response.data.email);
          setProfileImage(response.data.profileImage || "");
        })
        .catch(error => console.error("Error fetching user data:", error));
    }
  }, [userId]);

  // ✅ Handle Profile Picture Upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // ✅ Cloudinary preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;

      // ✅ Update user profile with new profile image
      const updatedUser = { ...user, profileImage: imageUrl };
      await axios.put(`http://localhost:5000/users/${userId}`, updatedUser);

      setProfileImage(imageUrl);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed. Please check Cloudinary settings.");
    }
  };

  // ✅ Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      firstName,
      lastName,
      age,
      email,
      profileImage
    };

    try {
      await axios.put(`http://localhost:5000/users/${userId}`, updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
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
        <h2 className="text-3xl font-bold mb-6 text-white">My Profile</h2>

        {/* Profile Image Upload */}
        <div className="relative inline-block">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-gray-700 object-cover"
            />
          ) : (
            <FaUserCircle size={128} className="mx-auto mb-4 text-gray-400" />
          )}

          {/* Camera Icon for Upload */}
          <label 
            htmlFor="profileUpload"
            className="absolute bottom-2 right-2 bg-gray-700 p-2 rounded-full text-white cursor-pointer hover:bg-gray-600 transition duration-200"
            title="Update Profile Picture"
          >
            <FaCamera size={18} />
          </label>
          <input
            type="file"
            id="profileUpload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {/* Editable Form */}
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-3 text-gray-300 text-left">
            <label className="block text-sm text-gray-400">First Name</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-500" 
              required 
            />

            <label className="block text-sm text-gray-400">Last Name</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-500" 
              required 
            />

            <label className="block text-sm text-gray-400">Age</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-500" 
              required 
            />

            <label className="block text-sm text-gray-400">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-500" 
              required 
            />

            {/* Save Button */}
            <button 
              type="submit"
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition duration-300"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-gray-300 text-left">
            <p><span className="font-semibold text-white">Name:</span> {user.firstName} {user.lastName}</p>
            <p><span className="font-semibold text-white">Username:</span> {user.username}</p>
            <p><span className="font-semibold text-white">Email:</span> {user.email}</p>
            <p><span className="font-semibold text-white">Age:</span> {user.age}</p>

            {/* Edit Button */}
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition duration-300"
            >
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
