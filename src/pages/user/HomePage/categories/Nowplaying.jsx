import React, { useEffect, useState } from "react";
import axios from "axios";
import Movierow from "./Movierow"; // Import the reusable row component

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 

const Nowplaying = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`)
      .then((response) => setMovies(response.data.results))
      .catch((error) => console.error("Error fetching now playing movies:", error));
  }, []);

  return <Movierow title="Now Playing" movies={movies} />;
};

export default Nowplaying;
