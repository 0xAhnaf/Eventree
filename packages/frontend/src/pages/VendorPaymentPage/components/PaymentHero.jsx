import { Building2, LockKeyhole } from "lucide-react";

function PaymentHero({ formattedFee }) {
  return (
    <section className="vpp-hero">
      <div className="vpp-hero-brand" aria-hidden="true">
        <Building2 size={31} />
      </div>

      <div className="vpp-hero-copy">
        <span className="vpp-eyebrow">Final registration step</span>
        <h1>Complete Your Vendor Registration</h1>
        <p>Make the one-time registration payment to continue to your dashboard.</p>
      </div>

      <div className="vpp-hero-payment">
        <span>Amount payable</span>
        <strong>{formattedFee}</strong>
        <small>
          <LockKeyhole size={14} /> Secure checkout
        </small>
      </div>
    </section>
  );
}

export default PaymentHero;
