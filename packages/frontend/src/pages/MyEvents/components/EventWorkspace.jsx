import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { VENDOR_CATEGORIES, eventDateLabel, eventFinished, money, todayLocal, vendorSearchLink } from "../eventUtils";
import VendorReviewDraft from "./VendorReviewDraft";
export default function EventWorkspace({event, busy, onBack, onEdit, onDelete, onComplete}) {
  const done = eventFinished(event);
  const winners = event.bookings.filter(b => ["accepted","completed"].includes(b.status));
  return <>
    <button className="me-back" onClick={onBack}><ArrowLeft size={18}/> All events</button>
    <section className="me-panel">
      <div className="me-row"><div><span className="me-eyebrow">{event.category}</span><h1>{event.title}</h1></div><span className="me-badge">{done ? "Completed" : event.status}</span></div>
      <div className="me-meta"><span>{eventDateLabel(event.date)}</span><span>{event.location}</span><span>{event.guests} guests</span><span>Budget: {money(event.budget)}</span></div>
      {!done && <div className="me-actions"><button className="me-secondary" onClick={onEdit} disabled={busy}>Edit details</button>
        <button className="me-primary" onClick={onComplete} disabled={busy || event.date > todayLocal()}>Complete event</button>
        {!event.has_bookings && <button className="me-danger" onClick={onDelete} disabled={busy}>Delete event</button>}
      </div>}
      {!done && <p className="me-note">Complete event becomes available on the event date. Confirmed means at least one vendor has accepted.</p>}
    </section>
    <section className="me-panel"><h2>Your vendor team</h2><p>Request several vendors in a category. Once one accepts, the other pending requests in that category close automatically.</p>
      <div className="me-category-grid">{VENDOR_CATEGORIES.map(category => {
        const requests = event.bookings.filter(b => b.category === category);
        const winner = winners.find(b => b.category === category);
        return <article key={category} className="me-category"><h3>{category}</h3>
          {!requests.length && <p>No vendors requested yet.</p>}
          {requests.map(booking => <div className="me-request" key={booking.id}><div><Link to={`/browse-vendor/${booking.vendor_id}?eventId=${event.id}`}>{booking.vendor_name}</Link><small>{booking.package_name || "Custom booking"}</small></div><span className={"me-badge me-" + booking.status}>{booking.status}</span></div>)}
          {winner ? <p className="me-chosen"><Check size={16}/> Vendor selected</p> : !done && event.date >= todayLocal() && <Link className="me-secondary" to={vendorSearchLink(event.id,category)}><Plus size={16}/> Find {category}</Link>}
        </article>;
      })}</div>
    </section>
    {done && <section className="me-panel"><h2>Review your vendors</h2><p>Review forms are a frontend preview. No rating is sent to a vendor or added to their public profile.</p>
      {winners.length ? <div className="me-category-grid">{winners.map(b => <VendorReviewDraft key={b.id} booking={b}/>)}</div> : <p>No confirmed vendors to review.</p>}
    </section>}
  </>;
}
