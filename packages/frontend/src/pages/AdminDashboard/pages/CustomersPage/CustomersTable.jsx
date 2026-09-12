import { DeleteAction, EmptyState, StatusBadge, ViewAction } from "../../components/management/ManagementUI";

const initials = (name = "") => name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const CustomersTable = ({ customers, loading, error, onView, onDelete }) => {
  if (loading) return <div className="management-loading">Loading customers...</div>;
  if (error) return <div className="management-error">{error}</div>;
  if (!customers.length) return <EmptyState />;
  return (
    <div className="management-scroll"><table className="management-table">
      <thead><tr><th>Customer</th><th>Phone</th><th>Bookings</th><th>Joined</th><th>Status</th><th aria-label="Actions" /></tr></thead>
      <tbody>{customers.map((customer) => <tr key={customer.id}>
        <td data-label="Customer"><div className="management-identity"><span className="management-avatar">{initials(customer.name)}</span><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div></td>
        <td data-label="Phone">{customer.phone || "Not provided"}</td><td data-label="Bookings">{customer.bookings ?? 0}</td><td data-label="Joined">{customer.joinedAt}</td><td data-label="Status"><StatusBadge status={customer.status} /></td>
        <td data-label="Actions"><div className="management-actions"><ViewAction label={customer.name} onClick={() => onView(customer)} /><DeleteAction label={customer.name} onClick={() => onDelete(customer)} /></div></td>
      </tr>)}</tbody>
    </table></div>
  );
};
export default CustomersTable;
