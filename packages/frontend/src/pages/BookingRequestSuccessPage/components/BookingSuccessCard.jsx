import { CalendarDays, PackageCheck } from "lucide-react";
import BookingProgressRing from "./BookingProgressRing.jsx";

const formatEventDate = (eventDate) => {
  if (!eventDate) return "Selected event date";

  const parsedDate = new Date(`${eventDate}T00:00:00`);

  return Number.isNaN(parsedDate.getTime())
    ? eventDate
    : parsedDate.toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

function BookingSuccessCard({ vendorName, eventDate, packageName, onReturn }) {
  return (
    <section className="brs-card" aria-live="polite">
      <BookingProgressRing />

      <p className="brs-eyebrow">Request submitted</p>
      <h1>Booking Request Sent Successfully</h1>
      <p className="brs-description">
        Your request has been sent to <strong>{vendorName}</strong>. The vendor
        will review the event details and respond to your request.
      </p>

      <div className="brs-request-summary">
        <div>
          <CalendarDays size={19} />
          <span>
            <small>Event date</small>
            <strong>{formatEventDate(eventDate)}</strong>
          </span>
        </div>

        <div>
          <PackageCheck size={19} />
          <span>
            <small>Package</small>
            <strong>{packageName}</strong>
          </span>
        </div>
      </div>

      <p className="brs-redirect-note">
        Returning to the vendor details page in a moment…
      </p>

      <button type="button" className="brs-return-button" onClick={onReturn}>
        Return now
      </button>
    </section>
  );
}

export default BookingSuccessCard;
