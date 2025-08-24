import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductReviews({ productId, user }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/product/${productId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleSubmit = async () => {
    if (!user) return alert("Please login to submit a review");

    try {
      await axios.post("/api/reviews", {
        rating,
        comment,
        userId: user.id,
        productId,
      });
      setRating(0);
      setComment("");
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      <ul className="mb-4">
        {reviews.map((rev, idx) => (
          <li key={idx} className="border-b py-2">
            <strong>{rev.User?.name}</strong> ⭐ {rev.rating}/5
            <p>{rev.comment}</p>
          </li>
        ))}
      </ul>

      {user && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">Leave a Review</h3>
          <select
            className="mb-2 p-1 border rounded"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} ⭐</option>
            ))}
          </select>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows="3"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}
