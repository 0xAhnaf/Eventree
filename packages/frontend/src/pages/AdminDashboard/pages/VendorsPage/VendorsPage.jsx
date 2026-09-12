import { useEffect, useMemo, useState } from "react";
import { Clock3, Store } from "lucide-react";
import { ConfirmDialog, DetailsDialog, DirectoryToolbar, PreviewNotice, SummaryCard } from "../../components/management/ManagementUI";
import { approveVendor, deleteVendor, getVendors, isAdminPreviewMode } from "../../services/adminManagementService";
import VendorsTable from "./VendorsTable";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]), [search, setSearch] = useState(""), [category, setCategory] = useState("all"), [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null), [deleteTarget, setDeleteTarget] = useState(null), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [approvingId, setApprovingId] = useState(null), [error, setError] = useState("");
  useEffect(() => { getVendors().then(setVendors).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  const paid = useMemo(() => vendors.filter((item) => item.paymentStatus === "paid"), [vendors]);
  const pending = paid.filter((item) => item.approvalStatus === "pending").length;
  const options = useMemo(() => [{ value: "all", label: "All categories" }, ...Array.from(new Set(paid.map((item) => item.category))).sort().map((value) => ({ value, label: value }))], [paid]);
  const shown = useMemo(() => { const query = search.trim().toLowerCase(); return paid.filter((item) => (tab === "all" || item.approvalStatus === "pending") && (category === "all" || item.category === category) && (!query || [item.businessName, item.ownerName, item.email, item.location].some((value) => value.toLowerCase().includes(query)))); }, [paid, tab, category, search]);
  const handleApprove = async (vendor) => { setApprovingId(vendor.id); try { await approveVendor(vendor.id); setVendors((items) => items.map((item) => item.id === vendor.id ? { ...item, approvalStatus: "approved" } : item)); } catch (err) { setError(err.message); } finally { setApprovingId(null); } };
  const confirmDelete = async () => { setBusy(true); try { await deleteVendor(deleteTarget.id); setVendors((items) => items.filter((item) => item.id !== deleteTarget.id)); setDeleteTarget(null); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  return <section className="dashboard-section dashboard-full-width">
    {isAdminPreviewMode() && <PreviewNotice />}
    <div className="management-summary-grid"><SummaryCard icon={Store} label="All paid vendors" value={paid.length} note="Completed signup payment" /><SummaryCard icon={Clock3} label="Pending approval" value={pending} note="Paid and awaiting admin approval" tone="gold" /></div>
    <div className="management-directory"><div className="management-heading"><div><span>Vendor management</span><h2>Vendor directory & approvals</h2></div><p>Only vendors with completed signup payment belong in this directory.</p></div>
      <div className="management-tabs" role="tablist"><button type="button" role="tab" aria-selected={tab === "all"} className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>All vendors <span>{paid.length}</span></button><button type="button" role="tab" aria-selected={tab === "pending"} className={tab === "pending" ? "active" : ""} onClick={() => setTab("pending")}>Pending approval <span>{pending}</span></button></div>
      <DirectoryToolbar search={search} setSearch={setSearch} placeholder="Search vendor, owner, email, or location" filter={category} setFilter={setCategory} label="Vendor category" options={options} />
      <VendorsTable vendors={shown} loading={loading} error={error} approvingId={approvingId} onView={setSelected} onApprove={handleApprove} onDelete={setDeleteTarget} />
    </div>
    {selected && <DetailsDialog title={selected.businessName} subtitle={`Owned by ${selected.ownerName}`} onClose={() => setSelected(null)} fields={[{ label: "Email", value: selected.email }, { label: "Phone", value: selected.phone }, { label: "Category", value: selected.category }, { label: "Location", value: selected.location }, { label: "Payment", value: selected.paymentStatus }, { label: "Approval", value: selected.approvalStatus }, { label: "Joined", value: selected.joinedAt }, { label: "Vendor ID", value: selected.id }]} />}
    {deleteTarget && <ConfirmDialog title="Delete vendor?" message={`${deleteTarget.businessName} will be removed from vendor management.`} busy={busy} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
  </section>;
};
export default VendorsPage;
