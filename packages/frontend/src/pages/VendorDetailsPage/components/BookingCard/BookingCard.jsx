import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { createVendorBooking } from "../../../../services/vendorApi.js";
import { listEvents } from "../../../../services/eventsApi.js";
import { todayLocal, eventFinished } from "../../../MyEvents/eventUtils.js";
import "./BookingCard.css";

export default function BookingCard({
  vendor = {}, bookedDates = [], selectedDate = "", onDateChange,
  onEventSelect, selectedPackageId = "", onPackageChange, onBookingCreated,
}) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retry, setRetry] = useState(0);
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentEventId, setSentEventId] = useState("");
  const eventId = params.get("eventId") || "";
  const event = events.find(item => String(item.id) === eventId);
  const packageOptions = Array.isArray(vendor.packages) ? vendor.packages : [];
  const selectedPackageDetails = useMemo(() => packageOptions.find(p => String(p.id) === String(selectedPackageId)), [packageOptions, selectedPackageId]);

  useEffect(() => {
    let active = true;
    setEvents([]); setLoadError("");
    if (user?.role !== "customer") { setLoading(false); return; }
    setLoading(true);
    listEvents().then(items => {
      if (active) setEvents(items.filter(item => !eventFinished(item) && item.date >= todayLocal()));
    }).catch(err => {if (active) setLoadError(err.message);})
      .finally(() => {if (active) setLoading(false);});
    return () => {active = false;};
  }, [user?.id, user?.role, retry]);
  useEffect(() => { onEventSelect?.(event?.date || ""); }, [event?.date, onEventSelect]);
  useEffect(() => {setSentEventId(""); setRequestError("");}, [vendor.id]);

  const alreadyRequested = event?.bookings?.some(b => String(b.vendor_id) === String(vendor.id) && ["pending","accepted","completed"].includes(b.status));
  const categoryTaken = event?.bookings?.some(b => b.category === vendor.category && ["accepted","completed"].includes(b.status));
  const unavailable = Boolean(event && bookedDates.includes(event.date));
  const submitted = alreadyRequested || (Boolean(sentEventId) && sentEventId === eventId);
  const createLink = "/my-events?" + new URLSearchParams({create:"1",returnTo:`/browse-vendor/${vendor.id}`}).toString();

  async function submit() {
    if (isSubmitting) return;
    setRequestError("");
    if (!user) {navigate("/login"); return;}
    if (user.role !== "customer") {setRequestError("Use a customer account to request a booking."); return;}
    if (!event) {setRequestError("Choose an event for this booking first."); return;}
    if (unavailable || submitted || categoryTaken) {setRequestError("This vendor or category is not available for the selected event."); return;}
    setIsSubmitting(true);
    try {
      await createVendorBooking({vendor_id:Number(vendor.id), package_id:selectedPackageDetails?.id || null, event_id:event.id});
      setSentEventId(String(event.id));
      try {await onBookingCreated?.();} catch { /* The booking already succeeded. */ }
      navigate(`/browse-vendor/${vendor.id}/booking-request-sent`, {
        replace:true,
        state:{bookingRequestSent:true,vendorId:vendor.id,vendorName:vendor.name || "the vendor",eventId:event.id,eventDate:event.date,packageName:selectedPackageDetails?.name || "No package selected"},
      });
    } catch (err) {setRequestError(err.message || "Could not send the booking request.");}
    finally {setIsSubmitting(false);}
  }

  return <div className="booking-card">
    <h2>Book This Vendor</h2>
    <div className="starting-price"><span>Starting from</span><h3>{vendor.price}</h3></div>
    {user?.role === "customer" && <div className="booking-field">
      <label htmlFor="booking-event">Choose your event</label>
      <select id="booking-event" value={event ? eventId : ""} disabled={loading || isSubmitting} onChange={e => {
        const next = new URLSearchParams(params);
        if(e.target.value) next.set("eventId",e.target.value); else next.delete("eventId");
        setParams(next,{replace:true}); setRequestError("");
      }}><option value="">{loading ? "Loading events…" : "Select an event"}</option>
        {events.map(item => <option key={item.id} value={item.id}>{item.title} — {item.date}</option>)}
      </select>
      {loadError && <p role="alert">{loadError} <button type="button" onClick={() => setRetry(n => n + 1)}>Retry</button></p>}
      {!loading && !loadError && eventId && !event && <p>This event is unavailable. Choose another upcoming event.</p>}
      <Link to={createLink} className="booking-create-event">{!loading && !events.length ? "Create your first event" : "+ Create another event"}</Link>
    </div>}
    <div className="booking-field-row"><div className="booking-field">
      <label htmlFor="booking-event-date">Event date</label>
      <input id="booking-event-date" type="date" value={event?.date || selectedDate} readOnly={Boolean(event)} onChange={e => onDateChange?.(e.target.value)}/>
    </div><div className="booking-field">
      <label htmlFor="booking-package">Select package</label>
      <select id="booking-package" value={selectedPackageId} disabled={isSubmitting} onChange={e => onPackageChange?.(e.target.value)}>
        {!packageOptions.length && <option value="">No package selected</option>}
        {packageOptions.map(p => <option key={p.id} value={String(p.id)}>{p.name} — {p.formattedPrice}</option>)}
      </select>
    </div></div>
    {event && <><div className="booking-field"><label htmlFor="booking-event-type">Event type</label><input id="booking-event-type" value={event.category} readOnly/></div>
      <div className="booking-field"><label htmlFor="booking-guests">Number of guests</label><input id="booking-guests" value={event.guests} readOnly/></div>
      <p className="booking-event-note">Date and guest details come from your selected event.</p></>}
    {submitted && <p className="booking-event-note" role="status">You already sent a request to this vendor for this event. Check My Events for its status.</p>}
    {categoryTaken && !submitted && <p className="booking-event-note">This event already has an accepted vendor in this category.</p>}
    {unavailable && <p className="booking-event-error">The vendor is unavailable on this event date.</p>}
    {requestError && <p className="booking-event-error" role="alert">{requestError}</p>}
    <button type="button" className="booking-button" disabled={isSubmitting || (user?.role === "customer" && (loading || !event || submitted || categoryTaken || unavailable))} onClick={submit}>
      {isSubmitting ? "Sending Request…" : !user ? "Log in to book" : "Send Booking Request"}
    </button>
  </div>;
}
