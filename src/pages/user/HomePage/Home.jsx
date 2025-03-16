import React from "react";
import HomeTopSection from "./HomeTopSection"; 
import Nowplaying from "./categories/Nowplaying";
import Toprated from "./categories/Toprated";
import Trendingmovies from "./categories/Trendingmovies";
import Upcoming from "./categories/Upcoming";
import Populartvshows from "./categories/Populartvshows";
import Airingnow from "./categories/Airingnow"; 

const Home = () => {
  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* Home Top Section (Netflix-style Fullscreen Banner) */}
      <HomeTopSection />

      <h1 className="text-4xl font-bold mb-6">Movies & TV Shows</h1>

      {/* Movie Sections */}
      <Nowplaying />
      <Toprated />
      <Trendingmovies />
      <Upcoming />

      {/* TV Show Sections */}
      <Populartvshows />
      <Airingnow /> {/* ✅ Now using Airingnow.jsx */}
    </div>
  );
};

export default Home;
