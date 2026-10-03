import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import {
  fetchVendorBookings,
  updateVendorBookingStatus,
  VENDOR_BOOKINGS_UPDATED_EVENT,
} from "../../../services/vendorApi.js";

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

function BookingRequests({ requests }) {
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      setBookings(await fetchVendorBookings());
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Could not load booking requests.");
    }
  }, []);

  useEffect(() => {
    if (!requests) {
      loadBookings();
    }
    window.addEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, loadBookings);

    return () => {
      window.removeEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, loadBookings);
    };
  }, [requests, loadBookings]);

  const pendingRequests = useMemo(() => {
    const list = requests && Array.isArray(requests) ? requests : bookings.filter((booking) => booking.status === "pending");

    return list.sort(
      (firstBooking, secondBooking) =>
        new Date(firstBooking.createdAt || firstBooking.created_at) -
        new Date(secondBooking.createdAt || secondBooking.created_at),
    );
  }, [requests, bookings]);

  const handleDecline = async (bookingId) => {
    try {
      await updateVendorBookingStatus(bookingId, "rejected");
    } catch (error) {
      setErrorMessage(error.message || "Booking could not be rejected.");
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await updateVendorBookingStatus(bookingId, "accepted");
    } catch (error) {
      setErrorMessage(error.message || "Booking could not be accepted.");
    }
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
        {errorMessage && <p className="booking-empty-VLP">{errorMessage}</p>}
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
            {pendingRequests.map((request) => {
              const clientName = request.clientName || request.customer?.name || "Client";
              const eventType = request.eventType || request.event_type || "Event type not provided";
              const eventDate = request.eventDate || request.event_date;
              const packageName = request.packageName || request.package_name || "Package not selected";

              return (
                <tr key={request.id}>
                  <td>
                    <div className="booking-client-VLP">
                      <span className="booking-avatar-VLP">
                        {getInitials(clientName)}
                      </span>

                      <span className="booking-client-name-VLP">
                        {clientName}
                      </span>
                    </div>
                  </td>

                  <td className="booking-cell-muted-VLP">
                    {eventType}
                  </td>

                  <td className="booking-cell-muted-VLP">
                    {formatDate(eventDate)}
                  </td>

                  <td>
                    <span className="booking-package-VLP">
                      {packageName}
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
            );
          })}

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
