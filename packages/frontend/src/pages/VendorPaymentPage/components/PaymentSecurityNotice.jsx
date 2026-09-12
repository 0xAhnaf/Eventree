import { Headphones, LockKeyhole, ShieldCheck } from "lucide-react";

function PaymentSecurityNotice() {
  return (
    <div className="vpp-security-grid">
      <div>
        <span className="vpp-security-icon">
          <ShieldCheck size={18} />
        </span>
        <span>
          <strong>Secure payment</strong>
          <small>Gateway-ready checkout</small>
        </span>
      </div>

      <div>
        <span className="vpp-security-icon">
          <LockKeyhole size={18} />
        </span>
        <span>
          <strong>Protected details</strong>
          <small>No payment data stored here</small>
        </span>
      </div>

      <div>
        <span className="vpp-security-icon">
          <Headphones size={18} />
        </span>
        <span>
          <strong>Need help?</strong>
          <small>Contact Eventree Support</small>
        </span>
      </div>
    </div>
  );
}

export default PaymentSecurityNotice;
