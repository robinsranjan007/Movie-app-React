import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/user/HomePage/Home";
import Movies from "../pages/user/movies/Movies";
import MoviesDetails from "../pages/Details/Moivesdetails";
import TvShows from "../pages/user/Tvshows/Tvshows";
import Tvshowdetails from "../pages/Details/Tvshowdetails";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import MyProfile from "../pages/Auth/myprofile/Myprofile";
import Favorites from "../pages/user/Favorite/Favorites";
import WatchLater from "../pages/user/Watchlater/Watchlater";

import Userslist from "../pages/admin/users/Userslists";
import Sidenavbar from "../layouts/sidenavbar/sidenavbar";
import UserDetailsList from "../pages/admin/users/userdetails/userdetailslists";
import ReviewsList from "../pages/admin/reviews/ReviewsList"; // ✅ Import Reviews List

/** ✅ Protect User Routes */
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("userId");
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

/** ✅ Protect Admin Routes */
const AdminRoute = ({ element }) => {
  const role = localStorage.getItem("role");
  return role === "admin" ? element : <Navigate to="/" replace />;
};

/** ✅ Fix: Ensure Sidebar & Admin Content Load Properly */
const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidenavbar /> {/* ✅ Sidebar appears only ONCE */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet /> {/* ✅ Admin pages (Userslist, ReviewsList) load here */}
      </main>
    </div>
  );
};

const RouterComponent = () => {
  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MoviesDetails />} />
      <Route path="/tv-shows" element={<TvShows />} />
      <Route path="/tv-shows/:id" element={<Tvshowdetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<MyProfile />} />

      {/* ✅ Protected Routes */}
      <Route path="/favorites" element={<ProtectedRoute element={<Favorites />} />} />
      <Route path="/watchlater" element={<ProtectedRoute element={<WatchLater />} />} />

      {/* ✅ Admin Routes with Sidebar */}
      <Route path="/admin/*" element={<AdminRoute element={<AdminLayout />} />}>
        <Route index element={<Navigate to="users" />} />
        <Route path="users" element={<Userslist />} />
        <Route path="users/details/:userId" element={<UserDetailsList />} />  
        <Route path="reviews" element={<ReviewsList />} />  {/* ✅ Added Reviews List */}
      </Route>
    </Routes>
  );
};

export default RouterComponent;
