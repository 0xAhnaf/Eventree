import React from "react";
import "./Reviews.css";

const Reviews = ({ vendor }) => {
  const reviews = Array.isArray(vendor.reviews) ? vendor.reviews : [];

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

      {!reviews.length && (
        <p>No customer reviews have been added yet.</p>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="review-header">
              <h4>{review.user ?? "Anonymous"}</h4>
            </div>

            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;