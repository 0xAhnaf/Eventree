import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { VENDOR_CATEGORIES, eventDateLabel, eventFinished, money, todayLocal, vendorSearchLink } from "../eventUtils";
import VendorReviewDraft from "./VendorReviewDraft";

export default function EventWorkspace({ event, busy, onBack, onEdit, onDelete, onComplete }) {
  const done = eventFinished(event);
  const winners = event.bookings.filter(b => ["accepted", "completed"].includes(b.status));

  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem("eventree_token");

      const response = await fetch(
        `http://localhost:8000/api/events/${event.id}/invoice/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      console.log("Invoice response status:", response.status);

      const contentType = response.headers.get("content-type");
      console.log("Invoice response type:", contentType);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Invoice error response:", errorText);
        throw new Error(`Invoice request failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `eventree-invoice-${event.id}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Invoice download error:", error);
    }
  };

  return (
    <>
      <button className="me-back" onClick={onBack}>
        <ArrowLeft size={18} /> All events
      </button>

      <section className="me-panel">
        <div className="me-row">
          <div>
            <span className="me-eyebrow">{event.category}</span>
            <h1>{event.title}</h1>
          </div>
          <span className="me-badge">{done ? "Completed" : event.status}</span>
        </div>

        <div className="me-meta">
          <span>{eventDateLabel(event.date)}</span>
          <span>{event.location}</span>
          <span>{event.guests} guests</span>
          <span>Budget: {money(event.budget)}</span>
        </div>

        {!done && (
          <div className="me-actions">
            <button className="me-secondary" onClick={onEdit} disabled={busy}>
              Edit details
            </button>

            <button
              className="me-primary"
              onClick={onComplete}
              disabled={busy || event.date >= todayLocal()}
            >
              Complete event
            </button>

            {!event.has_bookings && (
              <button className="me-danger" onClick={onDelete} disabled={busy}>
                Delete event
              </button>
            )}
          </div>
        )}

        {!done && winners.length > 0 && (
          <div className="me-actions" style={{ marginTop: "12px" }}>
            <button className="me-primary" onClick={handleDownloadInvoice}>
              Download Invoice
            </button>
          </div>
        )}

        {!done && (
          <p className="me-note">
            Complete event becomes available after the event date. Confirmed means at least one vendor has accepted.
          </p>
        )}
      </section>

      <section className="me-panel">
        <h2>Your vendor team</h2>

        <p>
          Request several vendors in a category. Once one accepts, the other pending requests in that category close automatically.
        </p>

        <div className="me-category-grid">
          {VENDOR_CATEGORIES.map((category) => {
            const requests = event.bookings.filter((b) => b.category === category);
            const winner = winners.find((b) => b.category === category);

            return (
              <article key={category} className="me-category">
                <h3>{category}</h3>

                {!requests.length && <p>No vendors requested yet.</p>}

                {requests.map((booking) => (
                  <div className="me-request" key={booking.id}>
                    <div>
                      <Link to={`/browse-vendor/${booking.vendor_id}?eventId=${event.id}`}>
                        {booking.vendor_name}
                      </Link>

                      <small>
                        {booking.package_name || "Custom booking"}
                      </small>
                    </div>

                    <span className={"me-badge me-" + booking.status}>
                      {booking.status}
                    </span>
                  </div>
                ))}

                {winner ? (
                  <p className="me-chosen">
                    <Check size={16} /> Vendor selected
                  </p>
                ) : (
                  !done &&
                  event.date >= todayLocal() && (
                    <Link
                      className="me-secondary"
                      to={vendorSearchLink(event.id, category)}
                    >
                      <Plus size={16} /> Find {category}
                    </Link>
                  )
                )}
              </article>
            );
          })}
        </div>
      </section>

      {done && (
        <section className="me-panel">
          <h2>Review your vendors</h2>

          <p>
            Review forms are a frontend preview. No rating is sent to a vendor or added to their public profile.
          </p>

          {winners.length ? (
            <div className="me-category-grid">
              {winners.map((b) => (
                <VendorReviewDraft key={b.id} booking={b} />
              ))}
            </div>
          ) : (
            <p>No confirmed vendors to review.</p>
          )}
        </section>
      )}
    </>
  );
}

