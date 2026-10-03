import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, UserCheck, Users } from "lucide-react";
import { ConfirmDialog, DetailsDialog, DirectoryToolbar, SummaryCard } from "../../components/management/ManagementUI";
import { deleteCustomer, getCustomers } from "../../services/adminManagementService";
import CustomersTable from "./CustomersTable";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getCustomers().then(setCustomers).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((item) => (filter === "all" || item.status === filter) && (!query || [item.name, item.email, item.phone].filter(Boolean).some((value) => value.toLowerCase().includes(query))));
  }, [customers, search, filter]);
  const active = customers.filter((item) => item.status === "active").length;
  const bookings = customers.reduce((sum, item) => sum + Number(item.bookings || 0), 0);

  const confirmDelete = async () => {
    setBusy(true);
    try { await deleteCustomer(deleteTarget.id); setCustomers((items) => items.filter((item) => item.id !== deleteTarget.id)); setDeleteTarget(null); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return <section className="dashboard-section dashboard-full-width">
    <div className="management-summary-grid"><SummaryCard icon={Users} label="Total customers" value={customers.length} note="Customer accounts only" /><SummaryCard icon={UserCheck} label="Active customers" value={active} note="Currently active accounts" /><SummaryCard icon={CalendarCheck2} label="Total bookings" value={bookings} note="Across listed customers" tone="slate" /></div>
    <div className="management-directory"><div className="management-heading"><div><span>Customer management</span><h2>Customer directory</h2></div><p>View customer information and remove accounts when required.</p></div>
      <DirectoryToolbar search={search} setSearch={setSearch} placeholder="Search by name, email, or phone" filter={filter} setFilter={setFilter} label="Account status" options={[{ value: "all", label: "All customers" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
      <CustomersTable customers={shown} loading={loading} error={error} onView={setSelected} onDelete={setDeleteTarget} />
    </div>
    {selected && <DetailsDialog title={selected.name} subtitle="Customer account" onClose={() => setSelected(null)} fields={[{ label: "Email", value: selected.email }, { label: "Phone", value: selected.phone }, { label: "Status", value: selected.status }, { label: "Bookings", value: selected.bookings }, { label: "Joined", value: selected.joinedAt }, { label: "Account ID", value: selected.id }]} />}
    {deleteTarget && <ConfirmDialog title="Delete customer?" message={`${deleteTarget.name}'s customer account will be removed.`} busy={busy} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
  </section>;
};
export default CustomersPage;
