import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/reviews");
        setReviews(response.data);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p className="text-gray-700">Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 w-full">
      <h1 className="text-2xl font-bold mb-4">Reviews List</h1>

      <ul className="bg-white p-4 shadow-lg rounded-lg">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review.id} className="border-b py-3">
              <p>
                <strong>👤 {review.username}:</strong> ⭐ {review.rating}/5
              </p>
              <p className="text-gray-600">{review.reviewText}</p>
              <Link
                to={`/admin/users/details/${review.userId}`}
                className="text-blue-500 hover:underline"
              >
                View User Details
              </Link>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No reviews found.</p>
        )}
      </ul>
    </div>
  );
};

export default ReviewsList;
