import React, { useState } from "react";
import "./Reviews.css";

const Reviews = ({ vendor }) => {
  const reviews = Array.isArray(vendor.reviews) ? vendor.reviews : [];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      return;
    }

    if (!comment.trim()) {
      return;
    }

    setSubmitStatus("submitting");

    try {
      // Replace this with your actual review API call
      // Example:
      //
      // await apiFetch("/api/reviews", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     vendor_id: vendor.id,
      //     rating,
      //     comment,
      //   }),
      // });

      setSubmitStatus("success");
    } catch (error) {
      console.error("Review submission failed:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <section className="reviews-section" id="reviews">
      <h2>Reviews</h2>

      <div className="rating-summary">
        <h3>{vendor.rating ?? 0}</h3>

        <div>
          <div className="stars">
            {vendor.rating
              ? "★".repeat(Math.round(vendor.rating)) +
                "☆".repeat(5 - Math.round(vendor.rating))
              : "☆☆☆☆☆"}
          </div>

          <p>
            Based on {vendor.reviewCount || 0} reviews
          </p>
        </div>
      </div>

      {/* Review Form */}
      <div className="review-form">
        <h3>Write a Review</h3>

        <div className="rating-input">
          <p>Your Rating</p>

          <div className="select-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={star <= rating ? "selected" : ""}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          disabled={submitStatus === "success"}
        />

        <button
          type="button"
          className="submit-review-btn"
          onClick={handleSubmit}
          disabled={
            submitStatus === "submitting" ||
            submitStatus === "success"
          }
        >
          {submitStatus === "submitting"
            ? "Submitting..."
            : submitStatus === "success"
            ? "Review Submitted"
            : submitStatus === "error"
            ? "Try Again"
            : "Submit Review"}
        </button>
      </div>

      {!reviews.length && (
        <p>No customer reviews have been added yet.</p>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="review-header">
              <h4>{review.user ?? "Anonymous"}</h4>

              <div className="review-stars">
                {"★".repeat(review.rating || 0)}
                {"☆".repeat(5 - (review.rating || 0))}
              </div>
            </div>

            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;

