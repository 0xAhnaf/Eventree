import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import {
  DEMO_VENDOR_ID,
  getVendorBookings,
  updateVendorBookingStatus,
  VENDOR_BOOKINGS_STORAGE_KEY,
  VENDOR_BOOKINGS_UPDATED_EVENT,
} from "../../../utils/vendorPortalStorage.js";

import "./BookingRequests.css";

const formatDate = (dateValue) => {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue || "Date not provided";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "CL";

function BookingRequests() {
  const [bookings, setBookings] = useState(() =>
    getVendorBookings(DEMO_VENDOR_ID),
  );

  useEffect(() => {
    const syncBookings = (event) => {
      if (
        event?.type === "storage" &&
        event.key &&
        event.key !== VENDOR_BOOKINGS_STORAGE_KEY
      ) {
        return;
      }

      setBookings(getVendorBookings(DEMO_VENDOR_ID));
    };

    window.addEventListener("storage", syncBookings);
    window.addEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, syncBookings);

    return () => {
      window.removeEventListener("storage", syncBookings);
      window.removeEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, syncBookings);
    };
  }, []);

  const pendingRequests = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === "pending")
        .sort(
          (firstBooking, secondBooking) =>
            new Date(firstBooking.createdAt) -
            new Date(secondBooking.createdAt),
        ),
    [bookings],
  );

  const handleDecline = (bookingId) => {
    updateVendorBookingStatus(bookingId, "rejected");
  };

  const handleAccept = (bookingId) => {
    updateVendorBookingStatus(bookingId, "accepted");
  };

  return (
    <div className="booking-requests-VLP">
      <div className="booking-requests-header-VLP">
        <h4 className="booking-requests-title-VLP">New Booking Requests</h4>

        <span className="booking-requests-badge-VLP">
          {pendingRequests.length} Pending
        </span>
      </div>

      <div className="booking-requests-table-wrap-VLP">
        <table className="booking-requests-table-VLP">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Event Type</th>
              <th>Date Requested</th>
              <th>Package</th>
              <th className="booking-requests-action-col-VLP">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="booking-client-VLP">
                    <span className="booking-avatar-VLP">
                      {getInitials(request.clientName)}
                    </span>

                    <span className="booking-client-name-VLP">
                      {request.clientName || "Client"}
                    </span>
                  </div>
                </td>

                <td className="booking-cell-muted-VLP">
                  {request.eventType || "Event type not provided"}
                </td>

                <td className="booking-cell-muted-VLP">
                  {formatDate(request.eventDate)}
                </td>

                <td>
                  <span className="booking-package-VLP">
                    {request.packageName || "Package not selected"}
                  </span>
                </td>

                <td>
                  <div className="booking-actions-VLP">
                    <button
                      type="button"
                      className="booking-action-btn-VLP booking-action-decline-VLP"
                      onClick={() => handleDecline(request.id)}
                      aria-label="Reject booking"
                      title="Reject booking"
                    >
                      <X size={18} />
                    </button>

                    <button
                      type="button"
                      className="booking-action-btn-VLP booking-action-accept-VLP"
                      onClick={() => handleAccept(request.id)}
                      aria-label="Accept booking"
                      title="Accept booking"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {pendingRequests.length === 0 && (
              <tr>
                <td colSpan="5" className="booking-empty-VLP">
                  No pending booking requests right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingRequests;
