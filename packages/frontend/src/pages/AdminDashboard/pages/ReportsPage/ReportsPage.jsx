import { useEffect, useState } from "react";
import { Building2, CalendarCheck2, Users, Wallet } from "lucide-react";
import RevenueChart from "../../components/RevenueChart/RevenueChart";
import { SummaryCard } from "../../components/management/ManagementUI";
import { getReports } from "../../services/adminManagementService";

const formatCurrency = (value = 0) => `৳${Number(value).toLocaleString("en-BD")}`;

const ReportsPage = () => {
  const [report, setReport] = useState({ metrics: {}, monthlyRevenue: [], bookingStatuses: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports()
      .then(setReport)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="management-loading">Loading reports...</div>;
  if (error) return <div className="management-error">{error}</div>;

  return (
    <section className="dashboard-section dashboard-full-width">
      <div className="management-summary-grid admin-report-grid">
        <SummaryCard icon={Wallet} label="Registration revenue" value={formatCurrency(report.metrics?.totalRevenue)} note="One-time vendor payments" />
        <SummaryCard icon={CalendarCheck2} label="Total bookings" value={report.metrics?.totalBookings || 0} note="All booking statuses" />
        <SummaryCard icon={Building2} label="Approved vendors" value={report.metrics?.activeVendors || 0} note="Visible marketplace vendors" />
        <SummaryCard icon={Users} label="Customers" value={report.metrics?.totalCustomers || 0} note="Registered customer accounts" tone="slate" />
      </div>

      <div className="dashboard-two-column">
        <div className="dashboard-main-card"><RevenueChart data={report.monthlyRevenue || []} /></div>
        <div className="dashboard-side-card">
          <div className="admin-status-report">
            <h3>Booking status breakdown</h3>
            <p>Current platform booking lifecycle</p>
            {Object.entries(report.bookingStatuses || {}).map(([status, total]) => (
              <div key={status}><span>{status}</span><strong>{total}</strong></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportsPage;
