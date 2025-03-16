import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // TMDb API Key from .env
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"; // High-quality images

const HomeTopSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch Popular Movies for Carousel
    axios
      .get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
      .then((response) => {
        if (response.data.results) {
          setMovies(response.data.results);
        }
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 3000); // Move to next slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [movies]); // Runs when `movies` data is updated

  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {movies.length > 0 && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${IMAGE_BASE_URL}${movies[currentIndex].backdrop_path})` }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Movie Info */}
          <div className="absolute bottom-10 left-10 text-white z-10 max-w-xl">
            <h1 className="text-4xl font-bold">{movies[currentIndex].title}</h1>
            <p className="text-gray-300 mt-2 text-sm line-clamp-3">
              {movies[currentIndex].overview ? movies[currentIndex].overview : "No description available."}
            </p>
            <p className="text-lg mt-2">📅 {movies[currentIndex].release_date}</p>

            {/* View Details Button */}
            <Link
              to={`/movies/${movies[currentIndex].id}`}
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
            >
              View Details
            </Link>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-500"
          >
            ❮
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-500"
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeTopSection;
