import React from "react";
import "./EventsHeader.css";

const EventsHeader = ({ onCreateEvent }) => {
  return (
    <header className="events-header">
      <div className="events-header-content">
        <h1>My Events</h1>

        <p>
          Manage and coordinate all your upcoming and past events. Elevate every
          detail with our premium planning tools.
        </p>
      </div>

      <button
        type="button"
        className="create-event-button"
        onClick={onCreateEvent}
      >
        <span>+</span>
        Create Event
      </button>
    </header>
  );
};

export default EventsHeader;
