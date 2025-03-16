import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateProfileInfo = ({ user, onSave, onClose }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ If changing password, validate fields
    if (newPassword || confirmNewPassword) {
      if (currentPassword !== user.password) {
        setError("Current password is incorrect!");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match!");
        return;
      }

      if (newPassword === currentPassword) {
        setError("New password cannot be the same as the current password.");
        return;
      }
    }

    // ✅ Create updated user object
    const updatedUser = {
      ...user,
      firstName,
      lastName,
      age,
      email,
      password: newPassword ? newPassword : user.password, // Update password if provided
      confirmPassword: newPassword ? newPassword : user.password, // Ensure confirmPassword matches
    };

    try {
      // ✅ Update user data on the server
      await axios.put(`http://localhost:5000/users/${user.id}`, updatedUser);

      // ✅ Pass updated user data back to parent component
      onSave(updatedUser);

      // ✅ Show success message
      alert("Profile updated successfully!");

      // ✅ Redirect to profile page
      navigate("/profile");

      // ✅ Close the modal
      onClose();
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("There was an error updating your profile.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[400px] relative">
        <h2 className="text-3xl font-bold mb-6 text-white">Update Profile</h2>

        {/* Error Message */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Current Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm New Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Save Changes
          </button>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white font-bold"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default UpdateProfileInfo;
