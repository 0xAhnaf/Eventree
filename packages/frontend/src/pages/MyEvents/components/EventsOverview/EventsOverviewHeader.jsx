import { Plus } from "lucide-react";

export default function EventsOverviewHeader({ onCreateEvent }) {
  return (
    <header className="me-header">
      <div>
        <span className="me-eyebrow">Your celebrations, together</span>
        <h1>My Events</h1>
        <p>Plan your events and bring the right vendors together.</p>
      </div>

      <button type="button" className="me-primary" onClick={onCreateEvent}>
        <Plus size={18} /> Create event
      </button>
    </header>
  );
}
