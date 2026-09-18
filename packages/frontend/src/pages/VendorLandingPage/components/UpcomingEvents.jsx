import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchVendorBookings,
  VENDOR_BOOKINGS_UPDATED_EVENT,
} from "../../../services/vendorApi.js";

import "./UpcomingEvents.css";

const getDateParts = (dateValue) => {
  const eventDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(eventDate.getTime())) {
    return {
      month: "---",
      day: "--",
    };
  }

  return {
    month: eventDate
      .toLocaleDateString("en-GB", {
        month: "short",
      })
      .toUpperCase(),

    day: String(eventDate.getDate()).padStart(2, "0"),
  };
};

function UpcomingEvents({ onViewCalendar }) {
  const [bookings, setBookings] = useState([]);

  const loadBookings = useCallback(async () => {
    try {
      setBookings(await fetchVendorBookings());
    } catch {
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    loadBookings();
    window.addEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, loadBookings);

    return () => {
      window.removeEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, loadBookings);
    };
  }, [loadBookings]);

  const upcomingEvents = useMemo(
    () =>
      bookings
        .filter((booking) => ["accepted", "confirmed"].includes(booking.status))
        .sort(
          (firstBooking, secondBooking) =>
            new Date(firstBooking.eventDate) -
            new Date(secondBooking.eventDate),
        )
        .slice(0, 3),
    [bookings],
  );

  return (
    <div className="upcoming-events-VLP">
      <h4 className="upcoming-events-title-VLP">Upcoming Events</h4>

      <div className="upcoming-events-list-VLP">
        {upcomingEvents.length ? (
          upcomingEvents.map((event) => {
            const { month, day } = getDateParts(event.eventDate);

            return (
              <div className="upcoming-event-item-VLP" key={event.id}>
                <div className="upcoming-event-date-VLP">
                  <span className="upcoming-event-month-VLP">{month}</span>

                  <span className="upcoming-event-day-VLP">{day}</span>
                </div>

                <div className="upcoming-event-info-VLP">
                  <p className="upcoming-event-name-VLP">
                    {event.eventType || "Event type not provided"}
                  </p>

                  <p className="upcoming-event-meta-VLP">
                    {event.clientName || "Client"} •{" "}
                    {event.packageName || "Package not selected"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="upcoming-event-item-VLP">
            <div className="upcoming-event-info-VLP">
              <p className="upcoming-event-name-VLP">
                No accepted upcoming events
              </p>

              <p className="upcoming-event-meta-VLP">
                Accepted booking requests will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="upcoming-events-btn-VLP"
        onClick={onViewCalendar}
      >
        View All Bookings
      </button>
    </div>
  );
}

export default UpcomingEvents;
