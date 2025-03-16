import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const WatchLater = () => {
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [watchLaterTvShows, setWatchLaterTvShows] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      alert("Please log in to view Watch Later movies.");
      return;
    }

    fetchWatchLater();
  }, []);

  const fetchWatchLater = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setWatchLaterMovies(response.data.watchLater || []);
      setWatchLaterTvShows(response.data.watchLaterTvShows || []);
    } catch (error) {
      console.error("Error fetching watch later items:", error);
    }
  };

  // ✅ Remove from Watch Later (Movies & TV Shows)
  const removeFromWatchLater = async (id, type) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const userData = response.data;

      const updatedMovies = type === "movie" ? userData.watchLater.filter((m) => m.id !== id) : userData.watchLater;
      const updatedTvShows = type === "tv" ? userData.watchLaterTvShows.filter((s) => s.id !== id) : userData.watchLaterTvShows;

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        watchLater: updatedMovies,
        watchLaterTvShows: updatedTvShows,
      });

      setWatchLaterMovies(updatedMovies);
      setWatchLaterTvShows(updatedTvShows);
      alert("Removed from Watch Later!");
    } catch (error) {
      console.error("Error removing from Watch Later:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold mb-6">My Watch Later Movies & TV Shows</h1>

      {/* ✅ Watch Later Movies */}
      {watchLaterMovies.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Movies</h2>
          <div className="grid grid-cols-4 gap-6 mb-6">
            {watchLaterMovies.map((movie) => (
              <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition">
                <img
                  src={movie.poster ? `${IMAGE_BASE_URL}${movie.poster}` : "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={movie.title}
                  className="w-full h-80 object-cover rounded-md"
                />
                <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                <button onClick={() => removeFromWatchLater(movie.id, "movie")} className="mt-2 w-full flex justify-center items-center bg-red-600 hover:bg-red-700 p-2 rounded">
                  <FaTrash className="mr-2" /> Remove
                </button>
                <Link to={`/movies/${movie.id}`} className="mt-2 block text-center bg-blue-600 hover:bg-blue-700 p-2 rounded">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ✅ Watch Later TV Shows */}
      {watchLaterTvShows.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">TV Shows</h2>
          <div className="grid grid-cols-4 gap-6">
            {watchLaterTvShows.map((show) => (
              <div key={show.id} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition">
                <img
                  src={show.poster ? `${IMAGE_BASE_URL}${show.poster}` : "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={show.title}
                  className="w-full h-80 object-cover rounded-md"
                />
                <h2 className="text-lg font-semibold mt-2">{show.title}</h2>
                <button onClick={() => removeFromWatchLater(show.id, "tv")} className="mt-2 w-full flex justify-center items-center bg-red-600 hover:bg-red-700 p-2 rounded">
                  <FaTrash className="mr-2" /> Remove
                </button>
                <Link to={`/tv-shows/${show.id}`} className="mt-2 block text-center bg-blue-600 hover:bg-blue-700 p-2 rounded">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ✅ No Items in Watch Later */}
      {watchLaterMovies.length === 0 && watchLaterTvShows.length === 0 && (
        <p className="text-gray-400 text-lg text-center mt-6">No movies or TV shows added to Watch Later yet.</p>
      )}
    </div>
  );
};

export default WatchLater;
