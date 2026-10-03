import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CircleDollarSign, Wallet } from "lucide-react";
import {
  DirectoryToolbar,
  EmptyState,
  StatusBadge,
  SummaryCard,
} from "../../components/management/ManagementUI";
import { getPayments } from "../../services/adminManagementService";

const formatCurrency = (value = 0) => `৳${Number(value).toLocaleString("en-BD")}`;
const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "Not available";

const PaymentsPage = () => {
  const [payload, setPayload] = useState({ summary: {}, payments: [] });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPayments()
      .then(setPayload)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const payments = Array.isArray(payload.payments) ? payload.payments : [];
  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter(
      (payment) =>
        !query ||
        [payment.businessName, payment.ownerName, payment.email, payment.category]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)),
    );
  }, [payments, search]);

  return (
    <section className="dashboard-section dashboard-full-width">
      <div className="management-summary-grid">
        <SummaryCard icon={Wallet} label="Registration revenue" value={formatCurrency(payload.summary?.totalRevenue)} note="Completed vendor payments" />
        <SummaryCard icon={BadgeCheck} label="Completed payments" value={payload.summary?.completedPayments || 0} note="Successful demo registrations" />
        <SummaryCard icon={CircleDollarSign} label="Registration fee" value={formatCurrency(payload.summary?.registrationFee)} note="One-time vendor fee" tone="gold" />
      </div>

      <div className="management-directory">
        <div className="management-heading">
          <div><span>Payment management</span><h2>Vendor registration payments</h2></div>
          <p>Registration payment records currently stored by EVENTREE.</p>
        </div>
        <DirectoryToolbar
          search={search}
          setSearch={setSearch}
          placeholder="Search vendor, owner, email, or category"
          filter="completed"
          setFilter={() => {}}
          label="Payment status"
          options={[{ value: "completed", label: "Completed" }]}
        />

        {loading && <div className="management-loading">Loading payments...</div>}
        {!loading && error && <div className="management-error">{error}</div>}
        {!loading && !error && !shown.length && <EmptyState />}
        {!loading && !error && shown.length > 0 && (
          <div className="management-scroll">
            <table className="management-table">
              <thead><tr><th>Vendor</th><th>Category</th><th>Paid at</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {shown.map((payment) => (
                  <tr key={payment.id}>
                    <td data-label="Vendor"><div className="management-identity"><span className="management-avatar">৳</span><div><strong>{payment.businessName}</strong><small>{payment.email}</small></div></div></td>
                    <td data-label="Category">{payment.category}</td>
                    <td data-label="Paid at">{formatDateTime(payment.paidAt)}</td>
                    <td data-label="Amount"><strong>{formatCurrency(payment.amount)}</strong></td>
                    <td data-label="Status"><StatusBadge status={payment.status} /></td>
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

export default PaymentsPage;
