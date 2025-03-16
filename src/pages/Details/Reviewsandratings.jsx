import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaTrash, FaEdit, FaSave, FaReply } from "react-icons/fa";

const ReviewsAndRatings = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminReplies, setAdminReplies] = useState({});

  // ✅ Get logged-in user details
  const userId = localStorage.getItem("userId") || "";
  const username = localStorage.getItem("username") || "";
  const userRole = localStorage.getItem("role") || ""; // "admin" or "user"

  useEffect(() => {
    if (userId && username) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    fetchReviews();
  }, [movieId, userId]);

  // ✅ Fetch all reviews for this movie
  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/reviews");

      const movieReviews = response.data.filter((r) => r.movieId.toString() === movieId.toString());
      setReviews(movieReviews);

      // ✅ Find if the logged-in user has already reviewed
      const userExistingReview = movieReviews.find((r) => r.userId === userId);
      setUserReview(userExistingReview || null);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // ✅ Handle Submitting a New Review (Fixed)
  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      alert("Please log in to post a review.");
      return;
    }

    if (userReview) {
      alert("You have already posted a review. Edit your existing one.");
      return;
    }

    const newReview = {
      id: Date.now().toString(), // Ensure unique ID
      movieId: movieId.toString(), // Fix potential type mismatch
      userId: userId,
      username: username,
      rating: rating,
      reviewText: reviewText,
      adminReply: "", // Ensure this field exists
    };

    try {
      await axios.post("http://localhost:5000/reviews", newReview);

      // ✅ Update UI instantly after posting
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setUserReview(newReview); // ✅ Prevent duplicate reviews
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  // ✅ Handle Admin Reply
  const handleReply = async (id) => {
    if (!adminReplies[id]?.trim()) {
      alert("Reply cannot be empty!");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/reviews/${id}`, {
        adminReply: adminReplies[id],
      });

      const updatedReviews = reviews.map((review) =>
        review.id === id ? { ...review, adminReply: adminReplies[id] } : review
      );

      setReviews(updatedReviews);
      setAdminReplies((prev) => ({ ...prev, [id]: "" })); // ✅ Keep original design, clear field after UI update
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // ✅ Handle Delete Review (Admin can delete any review, user can delete their own)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);

      // ✅ Update UI instantly
      const updatedReviews = reviews.filter((review) => review.id !== id);
      setReviews(updatedReviews);

      // ✅ If the user deleted their own review, reset their ability to post again
      if (userReview && userReview.id === id) {
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>

      {/* ✅ Hide "Add to Favorites" & "Watch Later" for Admin */}
      {userRole !== "admin" && (
        <div className="mb-4 flex space-x-4">
          <button className="bg-red-600 px-4 py-2 rounded text-white">Add to Favorites</button>
          <button className="bg-blue-600 px-4 py-2 rounded text-white">Watch Later</button>
        </div>
      )}

      {/* ✅ Show Review Form Only If User Hasn't Reviewed */}
      {!userReview && isLoggedIn && (
        <div className="mb-4">
          <label className="block text-lg mb-2">Your Rating:</label>
          <div className="flex space-x-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-600"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            className="w-full bg-gray-800 text-white p-2 rounded-md"
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button onClick={handleSubmitReview} className="mt-2 bg-blue-600 px-4 py-2 rounded text-white">
            Submit Review
          </button>
        </div>
      )}

      {/* ✅ Display All Reviews */}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 p-4 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{review.username}</p>
                <div className="flex text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>

              {/* ✅ Admin Delete or User Edit/Delete */}
              {(review.userId === userId || userRole === "admin") && (
                <div className="flex space-x-2">
                  {review.userId === userId && (
                    <button className="text-yellow-500">
                      <FaEdit />
                    </button>
                  )}
                  <button onClick={() => handleDelete(review.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            {/* ✅ Show User's Review Text */}
            <p className="mt-2">{review.reviewText}</p>

            {/* ✅ Admin Reply */}
            {review.adminReply && <p className="text-blue-400 mt-2">Admin: {review.adminReply}</p>}
            
            {/* ✅ Smaller, More Beautiful Reply Button */}
            {userRole === "admin" && (
              <div className="mt-2 flex items-center">
                <textarea
                  className="w-full bg-gray-700 text-white p-1 rounded-md text-sm"
                  placeholder="Write a reply..."
                  value={adminReplies[review.id] || ""}
                  onChange={(e) => setAdminReplies({ ...adminReplies, [review.id]: e.target.value })}
                />
                <button onClick={() => handleReply(review.id)} className="ml-2 bg-green-500 px-3 py-1 rounded text-white text-sm">
                  <FaReply />
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No reviews yet. Be the first to write one!</p>
      )}
    </div>
  );
};

export default ReviewsAndRatings;
