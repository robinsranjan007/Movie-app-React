import React, { useRef } from "react";
import { Link } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // TMDb Image URL

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);

  // Scroll Left
  const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  // Scroll Right
  const scrollRight = () => {
    rowRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mb-10 relative">
      <h2 className="text-white text-3xl font-bold mb-4">{title}</h2>

      {/* Left Scroll Button */}
      <button 
        onClick={scrollLeft} 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hidden md:flex hover:bg-opacity-70 z-10"
      >
        ❮
      </button>

      {/* Scrollable Movie Row */}
      <div ref={rowRef} className="flex space-x-6 overflow-hidden p-2">
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[250px]">
            <div className="relative bg-gray-900 p-4 rounded-xl text-white shadow-lg hover:scale-105 transition-transform duration-300">
              {/* Movie Poster */}
              <img
                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
                alt={movie.title}
                className="w-full h-[350px] object-cover rounded-lg"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 rounded-lg"></div>

              {/* Movie Info */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-gray-400 text-sm">{movie.release_date}</p>

                {/* View Details Button */}
                <Link
                  to={`/movies/${movie.id}`}
                  className="mt-2 inline-block text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Scroll Button */}
      <button 
        onClick={scrollRight} 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hidden md:flex hover:bg-opacity-70 z-10"
      >
        ❯
      </button>
    </div>
  );
};

export default MovieRow;
