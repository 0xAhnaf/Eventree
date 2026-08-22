import React from "react";
import EventCard from "../EventCard/EventCard";
import EmptyEventCard from "../EmptyEventCard/EmptyEventCard";

import "./EventGrid.css";

const EventGrid = ({ events, onManageEvent }) => {
  return (
    <section className="event-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onManageEvent={onManageEvent} />
      ))}

      <EmptyEventCard />
    </section>
  );
};

export default EventGrid;
