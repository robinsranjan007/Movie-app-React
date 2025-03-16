import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaClock } from "react-icons/fa";
import ReviewsAndRatings from "./ReviewsAndRatings";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const MoviesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovieDetails();
    if (userId) {
      fetchUserData();
    }
  }, [id]);

  // ✅ Fetch Movie Details
  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
      );
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError("Failed to load movie details.");
      setLoading(false);
    }
  };

  // ✅ Fetch User Data (Favorites & Watch Later)
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setFavorites(response.data.likedMovies || []);
      setWatchLater(response.data.watchLater || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // ✅ Add to Favorites
  const addToFavorites = async () => {
    if (!userId) {
      alert("Please log in to save favorites.");
      return;
    }

    if (favorites.some((m) => m.id === movie.id)) {
      alert("This movie is already in your favorites.");
      return;
    }

    const updatedFavorites = [...favorites, { id: movie.id, title: movie.title, poster: movie.poster_path }];

    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, { likedMovies: updatedFavorites });
      setFavorites(updatedFavorites);
      alert("Movie added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  // ✅ Add to Watch Later
  const addToWatchLater = async () => {
    if (!userId) {
      alert("Please log in to add to Watch Later.");
      return;
    }

    if (watchLater.some((m) => m.id === movie.id)) {
      alert("This movie is already in your Watch Later list.");
      return;
    }

    const updatedWatchLater = [...watchLater, { id: movie.id, title: movie.title, poster: movie.poster_path }];

    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, { watchLater: updatedWatchLater });
      setWatchLater(updatedWatchLater);
      alert("Movie added to Watch Later!");
    } catch (error) {
      console.error("Error adding to Watch Later:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white text-xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <p className="text-xl text-red-500">{error}</p>
        <button
          onClick={() => navigate("/movies")}
          className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Movie Banner */}
      <div className="relative w-full h-[500px]">
        <img
          src={movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : "https://via.placeholder.com/1280x720?text=No+Image"}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Movie Details */}
      <div className="px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold">{movie.title}</h1>
        <p className="text-gray-400 mt-2">
          📅 {movie.release_date} | ⭐ {movie.vote_average} / 10
        </p>

        <p className="mt-4 text-lg">
          <strong>Genres:</strong> {movie.genres.map((g) => g.name).join(", ")}
        </p>

        <p className="mt-4 text-gray-300 leading-relaxed">{movie.overview}</p>

        <div className="mt-4 text-gray-400">
          <p>⏳ Runtime: {movie.runtime} minutes</p>
          <p>🎬 Status: {movie.status}</p>
          <p>💰 Budget: ${movie.budget.toLocaleString()}</p>
          <p>💵 Revenue: ${movie.revenue.toLocaleString()}</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center mt-6 space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
            alt={movie.title}
            className="w-64 h-auto rounded-lg"
          />

          <div>
            <a
              href={`https://www.themoviedb.org/movie/${movie.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-lg"
            >
              View on TMDb
            </a>
          </div>
        </div>

        {/* Favorite & Watch Later Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={addToFavorites}
            className={`flex items-center space-x-2 px-4 py-2 rounded text-white ${
              favorites.some((m) => m.id === movie.id) ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={favorites.some((m) => m.id === movie.id)}
          >
            <FaHeart /> <span>{favorites.some((m) => m.id === movie.id) ? "Added to Favorites" : "Add to Favorites"}</span>
          </button>

          <button
            onClick={addToWatchLater}
            className={`flex items-center space-x-2 px-4 py-2 rounded text-white ${
              watchLater.some((m) => m.id === movie.id) ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={watchLater.some((m) => m.id === movie.id)}
          >
            <FaClock /> <span>{watchLater.some((m) => m.id === movie.id) ? "Added to Watch Later" : "Watch Later"}</span>
          </button>
        </div>

        {/* Reviews & Ratings Component */}
        <ReviewsAndRatings movieId={id} />
      </div>
    </div>
  );
};

export default MoviesDetails;
