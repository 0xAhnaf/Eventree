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

function UpcomingEvents({ events, onViewCalendar }) {
  const [bookings, setBookings] = useState([]);

  const loadBookings = useCallback(async () => {
    try {
      setBookings(await fetchVendorBookings());
    } catch {
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    if (!events) {
      loadBookings();
    }
    window.addEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, loadBookings);

    return () => {
      window.removeEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, loadBookings);
    };
  }, [events, loadBookings]);

  const upcomingEvents = useMemo(() => {
    const list = events && Array.isArray(events) ? events : bookings.filter((booking) => ["accepted", "confirmed"].includes(booking.status));

    return list
      .sort(
        (firstBooking, secondBooking) =>
          new Date(firstBooking.eventDate || firstBooking.event_date) -
          new Date(secondBooking.eventDate || secondBooking.event_date),
      )
      .slice(0, 3);
  }, [events, bookings]);

  return (
    <div className="upcoming-events-VLP">
      <h4 className="upcoming-events-title-VLP">Upcoming Events</h4>

      <div className="upcoming-events-list-VLP">
        {upcomingEvents.length ? (
          upcomingEvents.map((event) => {
            const dateValue = event.eventDate || event.event_date;
            const { month, day } = getDateParts(dateValue);

            return (
              <div className="upcoming-event-item-VLP" key={event.id}>
                <div className="upcoming-event-date-VLP">
                  <span className="upcoming-event-month-VLP">{month}</span>

                  <span className="upcoming-event-day-VLP">{day}</span>
                </div>

                <div className="upcoming-event-info-VLP">
                  <p className="upcoming-event-name-VLP">
                    {event.eventType || event.event_type || "Event type not provided"}
                  </p>

                  <p className="upcoming-event-meta-VLP">
                    {event.clientName || event.customer?.name || "Client"} •{" "}
                    {event.packageName || event.package_name || "Package not selected"}
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
