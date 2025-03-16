import React, { useEffect, useState } from "react";

const TvSidebar = ({ searchQuery, handleSearch, setGenre, handleSortChange, resetFilters }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres();
  }, []);

  // ✅ Fetch TV Show Genres from TMDb
  const fetchGenres = async () => {
    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search TV Shows..."
        className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
      />

      {/* Genre Filter */}
      <label className="block mb-2">Genre</label>
      <select
        onChange={(e) => setGenre(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {/* Sorting */}
      <label className="block mb-2">Sort By</label>
      <select
        onChange={handleSortChange}
        className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
      >
        <option value="popularity.desc">Popularity (High to Low)</option>
        <option value="popularity.asc">Popularity (Low to High)</option>
        <option value="first_air_date.desc">Release Date (Newest First)</option>
        <option value="first_air_date.asc">Release Date (Oldest First)</option>
      </select>

      {/* Reset Filters Button */}
      <button
        onClick={resetFilters}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mt-4"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default TvSidebar;
