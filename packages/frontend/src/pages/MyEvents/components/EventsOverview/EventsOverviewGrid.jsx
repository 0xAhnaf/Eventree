import EventSummaryCard from "../EventSummaryCard";
import EmptyEventsState from "./EmptyEventsState";

export default function EventsOverviewGrid({
  events = [],
  hasAnyEvents = false,
  onManageEvent,
}) {
  if (!events.length) {
    return <EmptyEventsState hasEvents={hasAnyEvents} />;
  }

  return (
    <section className="me-events-grid" aria-label="Your events">
      {events.map((event) => (
        <EventSummaryCard
          key={event.id}
          event={event}
          onManage={onManageEvent}
        />
      ))}
    </section>
  );
}
