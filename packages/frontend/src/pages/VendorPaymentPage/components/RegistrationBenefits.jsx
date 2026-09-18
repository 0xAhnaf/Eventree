import { CalendarCheck, Check, Image, Store, UsersRound } from "lucide-react";

const benefits = [
  { icon: Store, label: "A public Eventree vendor profile" },
  { icon: Image, label: "Portfolio and service showcase" },
  { icon: CalendarCheck, label: "Booking and availability tools" },
  { icon: UsersRound, label: "Access to potential customers" },
];

function RegistrationBenefits() {
  return (
    <section className="vpp-benefits">
      <span className="vpp-eyebrow">What your registration includes</span>
      <h2>Grow your business with Eventree</h2>
      <p className="vpp-benefits-intro">
        Your one-time registration supports the marketplace and unlocks the
        vendor tools created to help clients discover your services.
      </p>

      <ul>
        {benefits.map(({ icon: Icon, label }) => (
          <li key={label}>
            <span className="vpp-benefit-icon">
              <Icon size={18} />
            </span>
            <span>{label}</span>
            <Check className="vpp-benefit-check" size={17} />
          </li>
        ))}
      </ul>

      <div className="vpp-one-time-note">
        <strong>One-time fee</strong>
        <span>No recurring registration charge.</span>
      </div>
    </section>
  );
}

export default RegistrationBenefits;
