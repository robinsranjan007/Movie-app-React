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
      const userExistingReview = movieReviews.find((r) => r.userId === userId);
      setUserReview(userExistingReview || null);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // ✅ Handle Submitting a New Review
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
      id: Date.now().toString(),
      movieId: movieId.toString(),
      userId,
      username,
      rating,
      reviewText,
      adminReply: "", // Ensures admin reply is saved
    };

    try {
      await axios.post("http://localhost:5000/reviews", newReview);
      setReviews([...reviews, newReview]);
      setUserReview(newReview);
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  // ✅ Handle Editing a Review
  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditText(review.reviewText);
    setEditRating(review.rating);
  };

  // ✅ Handle Saving an Edited Review
  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      alert("Review cannot be empty!");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/reviews/${editingReviewId}`, {
        reviewText: editText,
        rating: editRating,
      });

      const updatedReviews = reviews.map((review) =>
        review.id === editingReviewId ? { ...review, reviewText: editText, rating: editRating } : review
      );

      setReviews(updatedReviews);
      setUserReview(updatedReviews.find((r) => r.userId === userId) || null);
      setEditingReviewId(null);
    } catch (error) {
      console.error("Error updating review:", error);
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
      setAdminReplies((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // ✅ Handle Deleting a Review
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);
      const updatedReviews = reviews.filter((review) => review.id !== id);
      setReviews(updatedReviews);
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
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className={star <= review.rating ? "text-yellow-400" : "text-gray-600"} />
                  ))}
                </div>
              </div>

              {(review.userId === userId || userRole === "admin") && (
                <div className="flex space-x-2">
                  {review.userId === userId && (
                    <button onClick={() => handleEdit(review)} className="text-yellow-500">
                      <FaEdit />
                    </button>
                  )}
                  <button onClick={() => handleDelete(review.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            <p className="mt-2">{review.reviewText}</p>
            {review.adminReply && <p className="text-blue-400 mt-2">Admin: {review.adminReply}</p>}

            {/* ✅ Admin Reply Section (Always Visible) */}
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
