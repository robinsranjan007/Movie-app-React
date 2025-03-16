import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";

const Stats = () => {
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/users")
      .then(response => {
        const users = response.data;

        // ✅ Map each user with their saved movie count
        const stats = users.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          watchLaterCount: user.watchLater ? user.watchLater.length : 0,
          favoritesCount: user.likedMovies ? user.likedMovies.length : 0,
        }));

        setUserStats(stats);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF5F6D"];

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 User Movie Stats</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* ✅ Watch Later Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Watch Later Distribution 📌</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={userStats}
              dataKey="watchLaterCount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {userStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* ✅ Favorite Movies Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Favorites Distribution ❤️</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={userStats}
              dataKey="favoritesCount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#FF4F4F"
              label
            >
              {userStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* ✅ Bar Chart */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[700px] mx-auto mt-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Movies Saved by Users</h3>
        <BarChart width={600} height={350} data={userStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "white" }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="watchLaterCount" fill="#0088FE" name="Watch Later 📌" />
          <Bar dataKey="favoritesCount" fill="#FF4F4F" name="Favorites ❤️" />
        </BarChart>
      </div>

      {/* ✅ User Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Detailed User Stats</h3>
        <table className="w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="border border-gray-600 px-4 py-2">User</th>
              <th className="border border-gray-600 px-4 py-2">Watch Later 📌</th>
              <th className="border border-gray-600 px-4 py-2">Favorites ❤️</th>
              <th className="border border-gray-600 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {userStats.map(user => (
              <tr key={user.id} className="text-center bg-gray-600 hover:bg-gray-700 transition">
                <td className="border border-gray-600 px-4 py-2">{user.name}</td>
                <td className="border border-gray-600 px-4 py-2">{user.watchLaterCount}</td>
                <td className="border border-gray-600 px-4 py-2">{user.favoritesCount}</td>
                <td className="border border-gray-600 px-4 py-2">
                  <Link to={`/admin/users/details/${user.id}`} className="text-blue-400 hover:underline">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stats;
