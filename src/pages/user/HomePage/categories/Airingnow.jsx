import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieRow from "./Movierow"; // Reusing the MovieRow component

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Airingnow = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`)
      .then((response) => setShows(response.data.results))
      .catch((error) => console.error("Error fetching airing TV shows:", error));
  }, []);

  return <MovieRow title="Airing Now" movies={shows} />;
};

export default Airingnow;
