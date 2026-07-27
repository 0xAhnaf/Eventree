import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Mail,
  Package,
  Star,
  UserRound,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";

import {
  DEMO_VENDOR_ID,
  getVendorBookings,
  updateVendorBookingStatus,
  VENDOR_BOOKINGS_STORAGE_KEY,
  VENDOR_BOOKINGS_UPDATED_EVENT,
} from "../../../../utils/vendorPortalStorage.js";

import "./VendorBookings.css";

const formatEventDate = (dateValue) => {
  if (!dateValue) {
    return "Date not provided";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  confirmed: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
};

const getStatusIcon = (status) => {
  if (status === "pending") {
    return <Clock3 size={14} />;
  }

  if (status === "rejected") {
    return <XCircle size={14} />;
  }

  return <CheckCircle2 size={14} />;
};

function VendorBookings() {
  const [activeTab, setActiveTab] =
    useState("upcoming");

  const [bookings, setBookings] = useState(() =>
    getVendorBookings(DEMO_VENDOR_ID)
  );

  useEffect(() => {
    const syncBookings = (event) => {
      if (
        event?.type === "storage" &&
        event.key &&
        event.key !==
          VENDOR_BOOKINGS_STORAGE_KEY
      ) {
        return;
      }

      setBookings(
        getVendorBookings(DEMO_VENDOR_ID)
      );
    };

    window.addEventListener("storage", syncBookings);
    window.addEventListener(
      VENDOR_BOOKINGS_UPDATED_EVENT,
      syncBookings
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncBookings
      );

      window.removeEventListener(
        VENDOR_BOOKINGS_UPDATED_EVENT,
        syncBookings
      );
    };
  }, []);

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.status !== "completed"
        )
        .sort(
          (firstBooking, secondBooking) =>
            new Date(firstBooking.eventDate) -
            new Date(secondBooking.eventDate)
        ),
    [bookings]
  );

  const acceptedUpcomingBookings = useMemo(
    () =>
      upcomingBookings.filter((booking) =>
        ["accepted", "confirmed"].includes(
          booking.status
        )
      ),
    [upcomingBookings]
  );

  const completedBookings = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.status === "completed"
        )
        .sort(
          (firstBooking, secondBooking) =>
            new Date(secondBooking.eventDate) -
            new Date(firstBooking.eventDate)
        ),
    [bookings]
  );

  const displayedBookings =
    activeTab === "upcoming"
      ? upcomingBookings
      : completedBookings;

  const handleBookingDecision = (
    bookingId,
    nextStatus
  ) => {
    updateVendorBookingStatus(
      bookingId,
      nextStatus
    );
  };

  return (
    <section className="vbk-page">
      <div className="vbk-summary-grid">
        <article className="vbk-summary-card">
          <span className="vbk-summary-icon vbk-summary-icon-upcoming">
            <CalendarDays size={21} />
          </span>

          <div>
            <span>Accepted upcoming events</span>
            <strong>
              {acceptedUpcomingBookings.length}
            </strong>
          </div>
        </article>

        <article className="vbk-summary-card">
          <span className="vbk-summary-icon vbk-summary-icon-completed">
            <CheckCircle2 size={21} />
          </span>

          <div>
            <span>Completed events</span>
            <strong>{completedBookings.length}</strong>
          </div>
        </article>
      </div>

      <div className="vbk-panel">
        <div className="vbk-panel-header">
          <div>
            <h2>Event bookings</h2>

            <p>
              Accept or reject booking requests,
              review accepted events, and see client
              ratings after completion.
            </p>
          </div>

          <div
            className="vbk-tabs"
            role="tablist"
            aria-label="Booking categories"
          >
            <button
              type="button"
              role="tab"
              aria-selected={
                activeTab === "upcoming"
              }
              className={
                activeTab === "upcoming"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("upcoming")
              }
            >
              Upcoming
              <span>{upcomingBookings.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={
                activeTab === "completed"
              }
              className={
                activeTab === "completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("completed")
              }
            >
              Completed
              <span>{completedBookings.length}</span>
            </button>
          </div>
        </div>

        {displayedBookings.length ? (
          <div className="vbk-list">
            {displayedBookings.map((booking) => (
              <article
                className="vbk-booking-card"
                key={booking.id}
              >
                <div className="vbk-booking-top">
                  <div className="vbk-date-block">
                    <CalendarDays size={19} />

                    <div>
                      <span>Event date</span>

                      <strong>
                        {formatEventDate(
                          booking.eventDate
                        )}
                      </strong>
                    </div>
                  </div>

                  <span
                    className={`vbk-status vbk-status-${booking.status}`}
                  >
                    {getStatusIcon(
                      booking.status
                    )}

                    {statusLabels[
                      booking.status
                    ] || booking.status}
                  </span>
                </div>

                <div className="vbk-booking-title">
                  <h3>
                    {booking.eventType ||
                      "Event type not provided"}
                  </h3>

                  <p>
                    {booking.packageName ||
                      "Package not selected"}
                  </p>
                </div>

                <div className="vbk-detail-grid">
                  <div className="vbk-detail-item">
                    <UserRound size={17} />

                    <div>
                      <span>Client</span>

                      <strong>
                        {booking.clientName ||
                          "Client"}
                      </strong>
                    </div>
                  </div>

                  <div className="vbk-detail-item">
                    <Mail size={17} />

                    <div>
                      <span>Email</span>

                      <strong>
                        {booking.clientEmail ||
                          "Not provided"}
                      </strong>
                    </div>
                  </div>

                  <div className="vbk-detail-item">
                    <UsersRound size={17} />

                    <div>
                      <span>Guests</span>

                      <strong>
                        {booking.guests ||
                          "Not provided"}
                      </strong>
                    </div>
                  </div>

                  <div className="vbk-detail-item">
                    <Package size={17} />

                    <div>
                      <span>Package</span>

                      <strong>
                        {booking.packageName ||
                          "Not selected"}
                      </strong>
                    </div>
                  </div>
                </div>

                {booking.status === "pending" && (
                  <div className="vbk-decision-row">
                    <button
                      type="button"
                      className="vbk-reject-button"
                      onClick={() =>
                        handleBookingDecision(
                          booking.id,
                          "rejected"
                        )
                      }
                    >
                      <X size={16} />
                      Reject
                    </button>

                    <button
                      type="button"
                      className="vbk-accept-button"
                      onClick={() =>
                        handleBookingDecision(
                          booking.id,
                          "accepted"
                        )
                      }
                    >
                      <Check size={16} />
                      Accept
                    </button>
                  </div>
                )}

                {booking.status ===
                  "completed" && (
                  <div className="vbk-rating-row">
                    <div className="vbk-rating-copy">
                      <span>Client rating</span>

                      {booking.rating ? (
                        <div className="vbk-rating-value">
                          <Star
                            size={18}
                            fill="currentColor"
                          />

                          <strong>
                            {Number(
                              booking.rating
                            ).toFixed(1)}
                          </strong>

                          <span>/ 5</span>
                        </div>
                      ) : (
                        <strong className="vbk-awaiting-rating">
                          Awaiting client rating
                        </strong>
                      )}
                    </div>

                    {booking.review && (
                      <p className="vbk-review-text">
                        “{booking.review}”
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="vbk-empty-state">
            <CalendarDays size={30} />

            <h3>
              No {activeTab} events yet
            </h3>

            <p>
              Event information will appear here
              when bookings are added.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default VendorBookings;