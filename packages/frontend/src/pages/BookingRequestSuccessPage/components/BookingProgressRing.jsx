import { Check } from "lucide-react";

function BookingProgressRing() {
  return (
    <div
      className="brs-progress-ring"
      role="img"
      aria-label="Booking request sent successfully"
    >
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="brs-progress-track" cx="60" cy="60" r="52" />
        <circle
          className="brs-progress-value"
          cx="60"
          cy="60"
          r="52"
          pathLength="100"
        />
      </svg>

      <span className="brs-progress-check">
        <Check size={44} strokeWidth={2.5} />
      </span>
    </div>
  );
}

export default BookingProgressRing;
