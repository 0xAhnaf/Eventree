import { useState } from "react";
export default function VendorReviewDraft({booking}) {
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  return <article className="me-review">
    <h3>{booking.vendor_name}</h3><p>{booking.category}</p>
    <label>Rating<select value={rating} onChange={e => setRating(e.target.value)}><option value="">Choose a rating</option>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>)}</select></label>
    <label>Your review<textarea rows={3} maxLength={2000} value={review} placeholder="Tell us about your experience" onChange={e => setReview(e.target.value)}/></label>
    <small>Preview only — reviews are not submitted or saved yet. This draft clears when you leave.</small>
  </article>;
}
