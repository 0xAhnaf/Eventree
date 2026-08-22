import React from "react";
import "./EventCard.css";

const EventCard = ({ event, onManageEvent }) => {
  const formatBudget = (amount) => {
    return `৳${amount.toLocaleString("en-BD")}`;
  };

  return (
    <article className="event-card">
      {/* Event Image */}
      <div className="event-card-image-wrapper">
        <img src={event.image} alt={event.title} className="event-card-image" />

        <span className="event-category">{event.category}</span>
      </div>

      {/* Event Information */}
      <div className="event-card-content">
        <div className="event-card-title-row">
          <h2>{event.title}</h2>

          <span
            className={`event-status event-status-${event.status.toLowerCase()}`}
          >
            {event.status}
          </span>
        </div>

        <div className="event-details">
          <div className="event-detail">
            <span>▣</span>
            <span>{event.date}</span>
          </div>

          <div className="event-detail">
            <span>⌖</span>
            <span>{event.location}</span>
          </div>

          <div className="event-detail">
            <span>♟</span>
            <span>{event.guests} Guests</span>
          </div>

          <div className="event-detail">
            <span>৳</span>
            <span>{formatBudget(event.budget)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="event-card-footer">
          <div className="event-vendors">
            {event.vendors?.map((vendor) => (
              <img
                key={vendor.id}
                src={vendor.image}
                alt={vendor.name}
                className="vendor-avatar"
              />
            ))}

            {event.extraVendors > 0 && (
              <span className="vendor-count">+{event.extraVendors}</span>
            )}
          </div>

          <button
            type="button"
            className="manage-event-button"
            onClick={() => onManageEvent(event)}
          >
            Manage Event
          </button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
