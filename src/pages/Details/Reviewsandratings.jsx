import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaTrash, FaEdit, FaSave } from "react-icons/fa";

const ReviewsAndRatings = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Get logged-in user details
  const userId = localStorage.getItem("userId") || "";
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    if (userId && username) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    fetchReviews();
  }, [movieId, userId]); // ✅ Re-fetch reviews when user switches

  // ✅ Fetch all reviews for this movie
  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/reviews");
      const movieReviews = response.data.filter((r) => r.movieId === movieId);
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
      movieId,
      userId,
      username,
      rating,
      reviewText,
    };

    try {
      await axios.post("http://localhost:5000/reviews", newReview);
      setReviews([...reviews, newReview]); // ✅ Update UI instantly
      setUserReview(newReview); // ✅ Prevent duplicate reviews
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  // ✅ Handle Edit Review
  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditText(review.reviewText);
    setEditRating(review.rating);
  };

  // ✅ Handle Save Edited Review (Fixes Save Button)
  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      alert("Review cannot be empty!");
      return;
    }

    try {
      // ✅ Update only the specific review in db.json
      await axios.patch(`http://localhost:5000/reviews/${editingReviewId}`, {
        reviewText: editText,
        rating: editRating,
      });

      // ✅ Update UI instantly
      const updatedReviews = reviews.map((review) =>
        review.id === editingReviewId
          ? { ...review, reviewText: editText, rating: editRating }
          : review
      );

      setReviews(updatedReviews);
      setUserReview({ ...userReview, reviewText: editText, rating: editRating });
      setEditingReviewId(null);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  // ✅ Handle Delete Review
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);
      const updatedReviews = reviews.filter((review) => review.id !== id);
      setReviews(updatedReviews);
      setUserReview(null); // ✅ Allow user to write a new review after deleting
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
          <button
            onClick={handleSubmitReview}
            className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
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

              {/* ✅ Show Edit & Delete Only for Logged-in User */}
              {review.userId === userId && (
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(review)} className="text-yellow-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            {/* ✅ Show Edit Form If User Is Editing */}
            {editingReviewId === review.id ? (
              <div className="mt-2">
                <div className="flex space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer ${star <= editRating ? "text-yellow-400" : "text-gray-600"}`}
                      onClick={() => setEditRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full bg-gray-700 text-white p-2 rounded-md"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  onClick={handleSaveEdit}
                  className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                >
                  <FaSave /> Save
                </button>
              </div>
            ) : (
              <p className="mt-2">{review.reviewText}</p>
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
