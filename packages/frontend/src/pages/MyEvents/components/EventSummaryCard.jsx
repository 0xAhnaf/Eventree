import { CalendarDays, MapPin, Users, Wallet } from "lucide-react";
import { eventDateLabel, eventFinished, money } from "../eventUtils";
export default function EventSummaryCard({event, onManage}) {
  const accepted = event.bookings.filter(b => ["accepted","completed"].includes(b.status)).length;
  return <article className="me-panel me-event-card">
    <div className="me-row"><span className="me-eyebrow">{event.category}</span><span className={"me-badge me-" + event.status.toLowerCase()}>{eventFinished(event) ? "Completed" : event.status}</span></div>
    <h2>{event.title}</h2>
    <div className="me-meta"><span><CalendarDays size={17}/>{eventDateLabel(event.date)}</span><span><MapPin size={17}/>{event.location}</span><span><Users size={17}/>{event.guests} guests</span><span><Wallet size={17}/>{money(event.budget)}</span></div>
    <div className="me-row me-card-bottom"><small>{accepted} confirmed vendor{accepted !== 1 ? "s" : ""}</small><button className="me-secondary" onClick={() => onManage(event.id)}>Manage event</button></div>
  </article>;
}
