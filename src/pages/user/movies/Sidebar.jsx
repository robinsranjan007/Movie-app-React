import React from "react";

const Sidebar = ({ searchQuery, handleSearch, setGenre, filterMovies, handleSortChange, resetFilters }) => {
  return (
    <div className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search movies..."
        className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
      />

      {/* Genre Filter */}
      <label className="block mb-2">Genre</label>
      <select
        onChange={(e) => {
          setGenre(e.target.value);
          filterMovies(searchQuery, e.target.value);
        }}
        className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
      >
        <option value="">All Genres</option>
        <option value="28">Action</option>
        <option value="12">Adventure</option>
        <option value="16">Animation</option>
        <option value="35">Comedy</option>
        <option value="80">Crime</option>
        <option value="18">Drama</option>
        <option value="14">Fantasy</option>
        <option value="27">Horror</option>
        <option value="10749">Romance</option>
        <option value="878">Sci-Fi</option>
      </select>

      {/* Sorting */}
      <label className="block mb-2">Sort By</label>
      <select
        onChange={handleSortChange}
        className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
      >
        <option value="popularity.desc">Popularity (High to Low)</option>
        <option value="popularity.asc">Popularity (Low to High)</option>
        <option value="release_date.desc">Release Date (Newest First)</option>
        <option value="release_date.asc">Release Date (Oldest First)</option>
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

export default Sidebar;
