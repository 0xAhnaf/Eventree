import { Check } from "lucide-react";
import { DeleteAction, EmptyState, StatusBadge, ViewAction } from "../../components/management/ManagementUI";

const initials = (name = "") => name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
const VendorsTable = ({ vendors, loading, error, approvingId, onView, onApprove, onDelete }) => {
  if (loading) return <div className="management-loading">Loading vendors...</div>;
  if (error) return <div className="management-error">{error}</div>;
  if (!vendors.length) return <EmptyState />;
  return <div className="management-scroll"><table className="management-table">
    <thead><tr><th>Vendor</th><th>Category</th><th>Location</th><th>Payment</th><th>Approval</th><th aria-label="Actions" /></tr></thead>
    <tbody>{vendors.map((vendor) => <tr key={vendor.id}>
      <td data-label="Vendor"><div className="management-identity"><span className="management-avatar">{initials(vendor.businessName)}</span><div><strong>{vendor.businessName}</strong><small>{vendor.ownerName}</small></div></div></td><td data-label="Category">{vendor.category}</td><td data-label="Location">{vendor.location}</td><td data-label="Payment"><StatusBadge status={vendor.paymentStatus} /></td><td data-label="Approval"><StatusBadge status={vendor.approvalStatus} /></td>
      <td data-label="Actions"><div className="management-actions">{vendor.approvalStatus === "pending" && <button type="button" className="management-action approve" disabled={approvingId === vendor.id} onClick={() => onApprove(vendor)}><Check size={15} />{approvingId === vendor.id ? "Approving" : "Approve"}</button>}<ViewAction label={vendor.businessName} onClick={() => onView(vendor)} /><DeleteAction label={vendor.businessName} onClick={() => onDelete(vendor)} /></div></td>
    </tr>)}</tbody>
  </table></div>;
};
export default VendorsTable;
