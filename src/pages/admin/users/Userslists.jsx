import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Userslist = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await axios.get("http://localhost:5000/users");
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle delete (For now, it just shows an alert)
  const handleDelete = (userId) => {
    alert(`⚠️ Warning: Are you sure you want to delete user ID ${userId}?`);
  };

  // Function to navigate to user details page
  const handleDetails = (userId) => {
    navigate(`/admin/users/details/${userId}`);
  };

  return (
    <div className="p-6 bg-gray-100 w-full">
      <h1 className="text-2xl font-bold mb-4">Admin - Users List</h1>

      {/* Show Loading */}
      {loading && <p className="text-gray-700">Loading users...</p>}

      {/* Show Error Message */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Show No Users Message */}
      {!loading && !error && users.length === 0 && (
        <p className="text-gray-700">No users found.</p>
      )}

      {/* Display Users Table */}
      {!loading && !error && users.length > 0 && (
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 border">ID</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Username</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Role</th>
              <th className="py-3 px-4 border">Actions</th> {/* New Action Column */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b hover:bg-gray-200">
                <td className="py-2 px-4 border">{user.id}</td>
                <td className="py-2 px-4 border">{user.firstName} {user.lastName}</td>
                <td className="py-2 px-4 border">{user.username}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border text-red-500">{user.role || "User"}</td>
                <td className="py-2 px-4 border flex space-x-2">
                  {/* Details Button */}
                  <button
                    onClick={() => handleDetails(user.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Details
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Userslist;