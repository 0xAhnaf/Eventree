import React from "react";
import "./Reviews.css";

const Reviews = ({ vendor }) => {
  const reviews = Array.isArray(vendor.reviews) ? vendor.reviews : [];

  return (
    <section className="reviews-section" id="reviews">
      <h2>Reviews</h2>

      <div className="rating-summary">
        <h3>{vendor.rating ?? "—"}</h3>

        <div>
          <div className="stars">{vendor.rating == null ? "☆☆☆☆☆" : "★★★★★"}</div>

          <p>Based on {vendor.reviewCount || 0} reviews</p>
        </div>
      </div>

      {!reviews.length && <p>No customer reviews have been added yet.</p>}

      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <h4>{review.name}</h4>

              <span>{review.rating}</span>
            </div>

            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
