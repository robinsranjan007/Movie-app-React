import React, { useEffect, useState } from "react";
import axios from "axios";
import Movierow from "./Movierow"; 

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Upcoming = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`)
      .then((response) => setMovies(response.data.results))
      .catch((error) => console.error("Error fetching upcoming movies:", error));
  }, []);

  return <Movierow title="Upcoming Movies" movies={movies} />;
};

export default Upcoming;
