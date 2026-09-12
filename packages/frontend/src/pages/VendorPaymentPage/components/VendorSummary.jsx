import { Mail, UserRound } from "lucide-react";

function VendorSummary({ user }) {
  return (
    <section className="vpp-vendor-summary" aria-label="Vendor account">
      <div className="vpp-summary-icon">
        <UserRound size={19} />
      </div>

      <div>
        <span>Registering as</span>
        <strong>{user?.name || "Eventree Vendor"}</strong>
      </div>

      <div className="vpp-summary-email">
        <Mail size={16} />
        <span>{user?.email || "Vendor account"}</span>
      </div>
    </section>
  );
}

export default VendorSummary;
