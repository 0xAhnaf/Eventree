import { AlertTriangle, Eye, FlaskConical, Search, Trash2, X } from "lucide-react";
import "./ManagementUI.css";

export const PreviewNotice = () => (
  <div className="management-preview-notice" role="status">
    <FlaskConical size={18} />
    <div><strong>Frontend preview data</strong><span>These are local UI samples, not backend accounts.</span></div>
  </div>
);

export const SummaryCard = ({ icon: Icon, label, value, note, tone = "green" }) => (
  <article className="management-summary-card">
    <span className={`management-summary-icon ${tone}`}><Icon size={21} /></span>
    <div><p>{label}</p><strong>{value}</strong><small>{note}</small></div>
  </article>
);

export const DirectoryToolbar = ({ search, setSearch, placeholder, filter, setFilter, label, options }) => (
  <div className="management-toolbar">
    <label className="management-search"><Search size={18} /><input type="search" value={search} placeholder={placeholder} aria-label={placeholder} onChange={(event) => setSearch(event.target.value)} /></label>
    <label className="management-filter"><span>{label}</span><select value={filter} onChange={(event) => setFilter(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
  </div>
);

const statusLabels = {
  active: "Active",
  inactive: "Inactive",
  paid: "Paid",
  approved: "Approved",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
};
export const StatusBadge = ({ status }) => <span className={`management-status ${status}`}><i />{statusLabels[status] || status}</span>;

export const EmptyState = () => <div className="management-empty"><Search size={24} /><h3>No matching records</h3><p>Try changing your search or filter.</p></div>;

export const ViewAction = ({ label, onClick }) => <button type="button" className="management-action" aria-label={`View ${label}`} title="View details" onClick={onClick}><Eye size={17} /></button>;
export const DeleteAction = ({ label, onClick }) => <button type="button" className="management-action danger" aria-label={`Delete ${label}`} title="Delete" onClick={onClick}><Trash2 size={17} /></button>;

export const DetailsDialog = ({ title, subtitle, fields, onClose }) => (
  <div className="management-dialog-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="management-dialog" role="dialog" aria-modal="true" aria-label={`${title} details`} onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>Account details</span><h2>{title}</h2><p>{subtitle}</p></div><button type="button" aria-label="Close details" onClick={onClose}><X size={20} /></button></header>
      <dl>{fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value ?? "Not provided"}</dd></div>)}</dl>
    </section>
  </div>
);

export const ConfirmDialog = ({ title, message, busy, onCancel, onConfirm }) => (
  <div className="management-dialog-backdrop" role="presentation" onMouseDown={onCancel}>
    <section className="management-confirm" role="alertdialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
      <span><AlertTriangle size={24} /></span><h2>{title}</h2><p>{message}</p>
      <div><button type="button" onClick={onCancel} disabled={busy}>Cancel</button><button type="button" className="danger" onClick={onConfirm} disabled={busy}>{busy ? "Deleting..." : "Delete"}</button></div>
    </section>
  </div>
);
