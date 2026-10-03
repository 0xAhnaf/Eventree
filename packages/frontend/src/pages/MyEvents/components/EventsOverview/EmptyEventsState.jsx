import { CalendarDays } from "lucide-react";

export default function EmptyEventsState({ hasEvents = false }) {
  return (
    <section className="me-panel me-empty">
      <CalendarDays size={36} />
      <h2>
        {hasEvents ? "No events in this view" : "Start with your first event"}
      </h2>
      <p>Create an event, then find vendors for each service you need.</p>
    </section>
  );
}
