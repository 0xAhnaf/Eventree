import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext";

import { createVendorBooking } from "../../../../services/vendorApi.js";

import "./BookingCard.css";

const BookingCard = ({
  vendor = {},
  bookedDates = [],
  selectedDate = "",
  onDateChange,
  selectedPackageId = "",
  onPackageChange,
  onBookingCreated,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const packageOptions = Array.isArray(vendor.packages) ? vendor.packages : [];

  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [dateError, setDateError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPackageDetails = useMemo(
    () =>
      packageOptions.find(
        (packageOption) => String(packageOption.id) === selectedPackageId,
      ) || null,
    [packageOptions, selectedPackageId],
  );

  const handleDateChange = (event) => {
    const newDate = event.target.value;

    setRequestError("");

    if (!newDate) {
      setDateError("");

      if (typeof onDateChange === "function") {
        onDateChange("");
      }

      return;
    }

    if (bookedDates.includes(newDate)) {
      setDateError("This date is unavailable. Please select another date.");

      return;
    }

    setDateError("");

    if (typeof onDateChange === "function") {
      onDateChange(newDate);
    }
  };

  const handleBookingRequest = async () => {
    setRequestError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      setRequestError(
        "Please use a customer account to send a booking request.",
      );

      return;
    }

    if (!selectedDate) {
      setRequestError("Please select an available event date.");

      return;
    }

    if (bookedDates.includes(selectedDate)) {
      setRequestError(
        "This date is no longer available. Please select another date.",
      );

      return;
    }

    if (!eventType.trim()) {
      setRequestError("Please enter the event type.");

      return;
    }

    if (!guests || Number(guests) < 1) {
      setRequestError("Please enter the number of guests.");

      return;
    }

    setIsSubmitting(true);

    try {
      await createVendorBooking({
        vendor_id: Number(vendor.id),
        package_id: selectedPackageDetails?.id || null,
        event_date: selectedDate,
        event_type: eventType.trim(),
        guests: Number(guests),
      });

      if (typeof onBookingCreated === "function") {
        try {
          await onBookingCreated();
        } catch {
          // The booking has already been stored successfully. A follow-up
          // availability refresh must not turn that success into a false error.
        }
      }

      navigate(`/browse-vendor/${vendor.id}/booking-request-sent`, {
        replace: true,
        state: {
          bookingRequestSent: true,
          vendorId: vendor.id,
          vendorName: vendor.name || "the vendor",
          eventDate: selectedDate,
          packageName: selectedPackageDetails?.name || "No package selected",
        },
      });
    } catch (error) {
      setRequestError(error.message || "The booking request could not be sent.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-card">
      <h2>Book This Vendor</h2>

      <div className="starting-price">
        <span>Starting from</span>

        <h3>{vendor.price}</h3>
      </div>

      <div className="booking-field-row">
        <div className="booking-field">
          <label htmlFor="booking-event-date">Event Date</label>

          <input
            id="booking-event-date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />

          {dateError && (
            <p
              style={{
                margin: "8px 0 0",
                color: "#b42318",
                fontSize: "13px",
                lineHeight: "1.4",
              }}
            >
              {dateError}
            </p>
          )}
        </div>

        <div className="booking-field">
          <label htmlFor="booking-package">Select Package</label>

          <select
            id="booking-package"
            value={selectedPackageId}
            onChange={(event) => {
              if (typeof onPackageChange === "function") {
                onPackageChange(event.target.value);
              }

              setRequestError("");
            }}
          >
            {!packageOptions.length && (
              <option value="">No package selected</option>
            )}
            {packageOptions.map((packageOption) => (
              <option key={packageOption.id} value={String(packageOption.id)}>
                {packageOption.name} — {packageOption.formattedPrice}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="booking-field">
        <label htmlFor="booking-event-type">Event Type</label>

        <input
          id="booking-event-type"
          type="text"
          value={eventType}
          onChange={(event) => {
            setEventType(event.target.value);
            setRequestError("");
          }}
          placeholder="Example: Wedding, Birthday, Corporate Event"
        />
      </div>

      <div className="booking-field">
        <label htmlFor="booking-guests">Number of Guests</label>

        <input
          id="booking-guests"
          type="number"
          min="1"
          value={guests}
          onChange={(event) => {
            setGuests(event.target.value);
            setRequestError("");
          }}
          placeholder="Enter guests"
        />
      </div>

      {requestError && (
        <p
          style={{
            margin: "0 0 12px",
            color: "#b42318",
            fontSize: "13px",
            lineHeight: "1.45",
          }}
          aria-live="polite"
        >
          {requestError}
        </p>
      )}

      <button
        type="button"
        className="booking-button"
        onClick={handleBookingRequest}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending Request..." : "Send Booking Request"}
      </button>
    </div>
  );
};

export default BookingCard;
