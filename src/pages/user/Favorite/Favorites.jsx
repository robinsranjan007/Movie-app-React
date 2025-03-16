import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Favorites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteTvShows, setFavoriteTvShows] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      alert("Please log in to view favorites.");
      return;
    }

    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setFavoriteMovies(response.data.likedMovies || []);
      setFavoriteTvShows(response.data.likedTvShows || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // ✅ Remove from Favorites (Movies & TV Shows)
  const removeFromFavorites = async (id, type) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const userData = response.data;

      const updatedMovies = type === "movie" ? userData.likedMovies.filter((m) => m.id !== id) : userData.likedMovies;
      const updatedTvShows = type === "tv" ? userData.likedTvShows.filter((s) => s.id !== id) : userData.likedTvShows;

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        likedMovies: updatedMovies,
        likedTvShows: updatedTvShows,
      });

      setFavoriteMovies(updatedMovies);
      setFavoriteTvShows(updatedTvShows);
      alert("Removed from Favorites!");
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold mb-6">My Favorite Movies & TV Shows</h1>

      {favoriteMovies.length === 0 && favoriteTvShows.length === 0 ? (
        <p className="text-gray-400 text-lg text-center mt-6">No favorite movies or TV shows yet.</p>
      ) : (
        <>
          {favoriteMovies.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Favorite Movies</h2>
              <div className="grid grid-cols-4 gap-6 mb-6">
                {favoriteMovies.map((movie) => (
                  <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition">
                    <img
                      src={movie.poster ? `${IMAGE_BASE_URL}${movie.poster}` : "https://via.placeholder.com/300x450?text=No+Image"}
                      alt={movie.title}
                      className="w-full h-80 object-cover rounded-md"
                    />
                    <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                    <button
                      onClick={() => removeFromFavorites(movie.id, "movie")}
                      className="mt-2 w-full flex justify-center items-center bg-red-600 hover:bg-red-700 p-2 rounded"
                    >
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

          {favoriteTvShows.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Favorite TV Shows</h2>
              <div className="grid grid-cols-4 gap-6">
                {favoriteTvShows.map((show) => (
                  <div key={show.id} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition">
                    <img
                      src={show.poster ? `${IMAGE_BASE_URL}${show.poster}` : "https://via.placeholder.com/300x450?text=No+Image"}
                      alt={show.title}
                      className="w-full h-80 object-cover rounded-md"
                    />
                    <h2 className="text-lg font-semibold mt-2">{show.title}</h2>
                    <button
                      onClick={() => removeFromFavorites(show.id, "tv")}
                      className="mt-2 w-full flex justify-center items-center bg-red-600 hover:bg-red-700 p-2 rounded"
                    >
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
        </>
      )}
    </div>
  );
};

export default Favorites;
