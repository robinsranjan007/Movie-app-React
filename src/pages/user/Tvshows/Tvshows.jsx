import React, { useEffect, useState } from "react";
import axios from "axios";
import TvSidebar from "./Tvsidebar"; // ✅ Sidebar for filters
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const TvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [filteredTvShows, setFilteredTvShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [genresList, setGenresList] = useState({});
  const totalPages = 25; // ✅ Fetching 500 TV shows

  useEffect(() => {
    fetchGenres();
    fetchTvShows();
  }, [sortBy, genre, searchQuery]);

  // ✅ Fetch TV Show Genres
  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
      );
      const genres = response.data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
      setGenresList(genres);
    } catch (error) {
      console.error("Error fetching TV genres:", error);
    }
  };

  // ✅ Fetch 500 TV Shows
  const fetchTvShows = async () => {
    let allTvShows = [];
    try {
      for (let i = 1; i <= totalPages; i++) {
        const apiUrl =
          sortBy === "trending"
            ? `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}&language=en-US&page=${i}`
            : `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=${sortBy}&page=${i}`;

        const response = await axios.get(apiUrl);
        allTvShows = [...allTvShows, ...response.data.results];
      }
      setTvShows(allTvShows);
      applyFilters(allTvShows);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    }
  };

  // ✅ Apply Filters (Search & Genre)
  const applyFilters = (showList = tvShows) => {
    let filtered = showList;

    if (searchQuery) {
      filtered = filtered.filter((show) =>
        show.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (genre) {
      filtered = filtered.filter((show) =>
        show.genre_ids.includes(parseInt(genre))
      );
    }

    setFilteredTvShows(filtered);
    setPage(1);
  };

  // ✅ Reset Filters
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("trending");
    setGenre("");
    fetchTvShows();
  };

  // ✅ Pagination (20 TV shows per page)
  const tvShowsPerPage = 20;
  const totalPagesAvailable = Math.ceil(filteredTvShows.length / tvShowsPerPage);
  const startIndex = (page - 1) * tvShowsPerPage;
  const endIndex = startIndex + tvShowsPerPage;
  const currentTvShows = filteredTvShows.slice(startIndex, endIndex);

  const nextPage = () => {
    if (page < totalPagesAvailable) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <TvSidebar
        searchQuery={searchQuery}
        handleSearch={(e) => setSearchQuery(e.target.value)}
        setGenre={setGenre}
        handleSortChange={(e) => setSortBy(e.target.value)}
        resetFilters={resetFilters}
      />

      {/* TV Shows Display */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-4xl font-bold">TV Shows</h1>

          {/* ✅ Reset Button */}
          <button
            onClick={resetFilters}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Reset Filters
          </button>
        </div>

        {/* TV Shows Grid */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          {currentTvShows.map((show) => (
            <div
              key={show.id}
              className="bg-gray-800 p-4 rounded-lg text-white shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {/* Show Poster */}
              <img
                src={
                  show.poster_path
                    ? `${IMAGE_BASE_URL}${show.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={show.name}
                className="w-full h-80 object-cover rounded-md"
              />

              {/* Show Details */}
              <div className="p-2">
                <h2 className="text-lg font-semibold mt-2">{show.name}</h2>
                <p className="text-gray-400 text-sm">⭐ TMDb: {show.vote_average}</p>

                {/* ✅ Display Genre Names */}
                <p className="text-gray-400 text-sm">
                  🎭 {show.genre_ids.map((id) => genresList[id]).join(", ")}
                </p>

                {/* ✅ Display First Air Date */}
                <p className="text-gray-400 text-sm">📅 {show.first_air_date}</p>

                {/* ✅ View Details Button */}
                <Link
                  to={`/tv-shows/${show.id}`}
                  className="mt-2 block text-center bg-red-600 hover:bg-red-700 p-2 rounded"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination Controls */}
        <div className="flex flex-col items-center mt-6">
          <div className="flex items-center space-x-4 mb-3">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className={`px-4 py-2 text-white rounded ${
                page === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              ❮ Prev
            </button>
            <span className="text-black text-lg">
              Page <span className="font-bold">{page}</span> /{" "}
              <span className="font-bold">{totalPagesAvailable}</span>
            </span>
            <button
              onClick={nextPage}
              disabled={page === totalPagesAvailable}
              className={`px-4 py-2 text-white rounded ${
                page === totalPagesAvailable ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Next ❯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvShows;
