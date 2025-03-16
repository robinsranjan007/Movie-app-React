import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const UserDetailsList = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log(`Fetching details for user ID: ${userId}`);
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        console.log("Fetched user details:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  // ✅ Delete Review
  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const updatedReviews = user.reviews.filter((review) => review.id !== reviewId);
      await axios.patch(`http://localhost:5000/users/${userId}`, { reviews: updatedReviews });
      setUser((prevUser) => ({ ...prevUser, reviews: updatedReviews }));
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };

  if (loading) return <p className="text-gray-700">Loading user details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!user) return <p className="text-gray-700">User not found.</p>;

  return (
    <div className="p-6 bg-gray-100 w-full">
      <h1 className="text-2xl font-bold mb-4">User Details - {user.firstName} {user.lastName}</h1>

      {/* User Information */}
      <div className="bg-white p-4 shadow-lg rounded-lg mb-4">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* Watch Later Movies */}
      <h2 className="text-xl font-bold mt-4">📌 Watch Later Movies</h2>
      <ul className="bg-white p-4 shadow-lg rounded-lg mb-4">
        {user.watchLater?.length > 0 ? (
          user.watchLater.map((movie) => (
            <li key={movie.id} className="border-b py-2 flex justify-between">
              <span>🎬 {movie.title}</span>
              <Link to={`/movies/${movie.id}`} className="text-blue-500 hover:underline">View Details</Link>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No movies added to Watch Later.</p>
        )}
      </ul>

      {/* Favorite Movies */}
      <h2 className="text-xl font-bold mt-4">❤️ Favorite Movies</h2>
      <ul className="bg-white p-4 shadow-lg rounded-lg mb-4">
        {user.likedMovies?.length > 0 ? (
          user.likedMovies.map((movie) => (
            <li key={movie.id} className="border-b py-2 flex justify-between">
              <span>🎬 {movie.title}</span>
              <Link to={`/movies/${movie.id}`} className="text-blue-500 hover:underline">View Details</Link>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No movies added to Favorites.</p>
        )}
      </ul>

      {/* Reviewed Movies */}
      <h2 className="text-xl font-bold mt-4">📝 Reviewed Movies</h2>
      <ul className="bg-white p-4 shadow-lg rounded-lg">
        {user.reviews?.length > 0 ? (
          user.reviews.map((review) => (
            <li key={review.id} className="border-b py-2 flex justify-between items-center">
              <div>
                🎬 <Link to={`/movies/${review.movieId}`} className="text-blue-500 hover:underline">{review.movieId}</Link>
                <p className="text-gray-600">⭐ {review.rating} - {review.reviewText}</p>
              </div>
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No movie reviews.</p>
        )}
      </ul>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-700"
      >
        Go Back
      </button>
    </div>
  );
};

export default UserDetailsList;