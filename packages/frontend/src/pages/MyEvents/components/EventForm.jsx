import { useState } from "react";
import { todayLocal } from "../eventUtils";
export default function EventForm({event, onSave, onCancel}) {
  const [form, setForm] = useState(event ? {title:event.title, category:event.category, date:event.date, location:event.location, guests:event.guests, budget:event.budget} : {title:"",category:"Birthday",date:"",location:"",guests:"",budget:""});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const locked = event?.has_bookings;
  const fields = [["title","Event name","text"],["category","Event type","text"],["date","Event date","date"],["location","Location","text"],["guests","Number of guests","number"],["budget","Budget (৳)","number"]];
  async function submit(e) {
    e.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    try { await onSave({...form, guests:Number(form.guests), budget:Number(form.budget)}, event?.id); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <section className="me-panel"><h2>{event ? "Edit event" : "Create an event"}</h2>
    <p>Keep your vendors and booking requests together in one place.</p>
    {locked && <p className="me-note">Date, type, location and guests are fixed because booking requests have already been sent.</p>}
    <form onSubmit={submit}>
      <div className="me-form-grid">{fields.map(([key,label,type]) => <label key={key}>{label}
        <input required type={type} value={form[key]} maxLength={key === "category" ? 100 : 255}
          min={type === "date" ? (event ? undefined : todayLocal()) : type === "number" ? (key === "guests" ? 1 : 0) : undefined}
          max={key === "guests" ? 1000000 : key === "budget" ? 999999999 : undefined}
          disabled={busy || (locked && ["date","category","location","guests"].includes(key))}
          onChange={e => setForm({...form,[key]:e.target.value})}/></label>)}</div>
      {error && <p role="alert" className="me-error">{error}</p>}
      <div className="me-actions"><button disabled={busy} className="me-primary">{busy ? "Saving…" : "Save event"}</button><button disabled={busy} type="button" className="me-secondary" onClick={onCancel}>Cancel</button></div>
    </form>
  </section>;
}
