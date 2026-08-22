import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext";

import { addVendorBookingRequest } from "../../../../utils/vendorPortalStorage.js";

import "./BookingCard.css";

const packageOptions = [
  {
    id: "general",
    name: "General Package",
  },
  {
    id: "premium",
    name: "Premium Package",
  },
];

const BookingCard = ({
  vendor = {},
  bookedDates = [],
  selectedDate = "",
  onDateChange,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedPackage, setSelectedPackage] = useState("general");

  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [dateError, setDateError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  const selectedPackageDetails = useMemo(
    () =>
      packageOptions.find(
        (packageOption) => packageOption.id === selectedPackage,
      ) || packageOptions[0],
    [selectedPackage],
  );

  const handleDateChange = (event) => {
    const newDate = event.target.value;

    setRequestMessage("");
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

  const handleBookingRequest = () => {
    setRequestMessage("");
    setRequestError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "client") {
      setRequestError("Please use a client account to send a booking request.");

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

    const bookingResult = addVendorBookingRequest({
      vendorId: Number(vendor.id),
      vendorName: vendor.name || "Vendor",
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      eventDate: selectedDate,
      eventType: eventType.trim(),
      packageId: selectedPackageDetails.id,
      packageName: selectedPackageDetails.name,
      guests: Number(guests),
    });

    if (!bookingResult.success) {
      setRequestError(bookingResult.message || "This date is unavailable.");

      return;
    }

    setRequestMessage(
      "Booking request sent. This date is now reserved and cannot be booked again unless the vendor rejects the request.",
    );

    setEventType("");
    setGuests("");
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
            value={selectedPackage}
            onChange={(event) => {
              setSelectedPackage(event.target.value);

              setRequestMessage("");
              setRequestError("");
            }}
          >
            {packageOptions.map((packageOption) => (
              <option key={packageOption.id} value={packageOption.id}>
                {packageOption.name}
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
            setRequestMessage("");
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
            setRequestMessage("");
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

      {requestMessage && (
        <p
          style={{
            margin: "0 0 12px",
            color: "#13734b",
            fontSize: "13px",
            fontWeight: "600",
            lineHeight: "1.45",
          }}
          aria-live="polite"
        >
          {requestMessage}
        </p>
      )}

      <button
        type="button"
        className="booking-button"
        onClick={handleBookingRequest}
      >
        Send Booking Request
      </button>
    </div>
  );
};

export default BookingCard;
