import React, { useEffect, useState } from "react";
import axios from "axios";
import Movierow from "./Movierow"; // Reusing the MovieRow component

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Populartvshows = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`)
      .then((response) => setShows(response.data.results))
      .catch((error) => console.error("Error fetching popular TV shows:", error));
  }, []);

  return <Movierow title="Popular TV Shows" movies={shows} />;
};

export default Populartvshows;
