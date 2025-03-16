import React, { useEffect, useState } from "react";
import axios from "axios";
import Movierow from "./Movierow"; 

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Trendingmovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
      .then((response) => setMovies(response.data.results))
      .catch((error) => console.error("Error fetching trending movies:", error));
  }, []);

  return <Movierow title="Trending Movies" movies={movies} />;
};

export default Trendingmovies;
