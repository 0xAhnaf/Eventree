import { useState } from "react";

export default function VendorReviewDraft({ booking }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitReview = async () => {
    if (!rating || !review.trim()) return;

    try {
      setSubmitting(true);
      setMessage("");

      const token = localStorage.getItem("eventree_token");

      // Submit rating
      const ratingResponse = await fetch(
        `http://localhost:8000/api/vendors/${booking.vendor_id}/rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            rating: Number(rating),
          }),
        }
      );

      if (!ratingResponse.ok) {
        throw new Error("Rating submission failed");
      }

      // Submit review
      const reviewResponse = await fetch(
        `http://localhost:8000/api/vendors/${booking.vendor_id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            comment: review.trim(),
          }),
        }
      );

      if (!reviewResponse.ok) {
        throw new Error("Review submission failed");
      }

      setSubmitted(true);
      setMessage("Review submitted successfully!");

      setRating(0);
      setReview("");

    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="me-review">
      <h3>{booking.vendor_name}</h3>

      <p>{booking.category}</p>

      {/* Rating */}
      <label>Rating</label>

      <div className="me-star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`me-star ${
              rating >= star ? "me-star-active" : ""
            }`}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Review */}
      <label>Your review</label>

      <textarea
        rows={3}
        maxLength={2000}
        value={review}
        placeholder="Tell us about your experience"
        onChange={(e) => setReview(e.target.value)}
      />

      {/* Submit */}
      <button
        type="button"
        className="me-submit-review"
        onClick={submitReview}
        disabled={
          !rating ||
          !review.trim() ||
          submitting ||
          submitted
        }
      >
        {submitting
          ? "Submitting..."
          : submitted
          ? "Review Submitted ✓"
          : "Submit Review"}
      </button>

      {/* Message */}
      {message && (
        <small
          className={
            submitted
              ? "me-review-success"
              : "me-review-error"
          }
        >
          {message}
        </small>
      )}
    </article>
  );
}
