import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, CheckCircle2, Clock3 } from "lucide-react";
import {
  DirectoryToolbar,
  EmptyState,
  StatusBadge,
  SummaryCard,
} from "../../components/management/ManagementUI";
import { getBookings } from "../../services/adminManagementService";

const formatDate = (value) => {
  if (!value) return "Not provided";
  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
};

const formatCurrency = (value) =>
  value === null || value === undefined
    ? "Price not set"
    : `৳${Number(value).toLocaleString("en-BD")}`;

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter(
      (booking) =>
        (status === "all" || booking.status === status) &&
        (!query ||
          [
            booking.vendorName,
            booking.customerName,
            booking.customerEmail,
            booking.eventType,
            booking.packageName,
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query))),
    );
  }, [bookings, search, status]);

  const pending = bookings.filter((item) => item.status === "pending").length;
  const accepted = bookings.filter((item) => item.status === "accepted").length;

  return (
    <section className="dashboard-section dashboard-full-width">
      <div className="management-summary-grid">
        <SummaryCard icon={CalendarCheck2} label="Total bookings" value={bookings.length} note="All booking requests" />
        <SummaryCard icon={Clock3} label="Pending" value={pending} note="Waiting for vendor response" tone="gold" />
        <SummaryCard icon={CheckCircle2} label="Accepted" value={accepted} note="Confirmed by vendors" tone="slate" />
      </div>

      <div className="management-directory">
        <div className="management-heading">
          <div><span>Booking management</span><h2>Platform bookings</h2></div>
          <p>Monitor customer requests and vendor booking activity.</p>
        </div>
        <DirectoryToolbar
          search={search}
          setSearch={setSearch}
          placeholder="Search vendor, customer, event, or package"
          filter={status}
          setFilter={setStatus}
          label="Booking status"
          options={[
            { value: "all", label: "All bookings" },
            { value: "pending", label: "Pending" },
            { value: "accepted", label: "Accepted" },
            { value: "rejected", label: "Rejected" },
            { value: "completed", label: "Completed" },
          ]}
        />

        {loading && <div className="management-loading">Loading bookings...</div>}
        {!loading && error && <div className="management-error">{error}</div>}
        {!loading && !error && !shown.length && <EmptyState />}
        {!loading && !error && shown.length > 0 && (
          <div className="management-scroll">
            <table className="management-table">
              <thead><tr><th>Booking</th><th>Customer</th><th>Event date</th><th>Package</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {shown.map((booking) => (
                  <tr key={booking.id}>
                    <td data-label="Booking"><div className="management-identity"><span className="management-avatar">#{booking.id}</span><div><strong>{booking.vendorName}</strong><small>{booking.eventType} · {booking.guests} guests</small></div></div></td>
                    <td data-label="Customer"><strong>{booking.customerName}</strong><br /><small>{booking.customerEmail}</small></td>
                    <td data-label="Event date">{formatDate(booking.eventDate)}</td>
                    <td data-label="Package">{booking.packageName || "Custom request"}</td>
                    <td data-label="Amount">{formatCurrency(booking.amount)}</td>
                    <td data-label="Status"><StatusBadge status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingsPage;
