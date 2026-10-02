import { CreditCard } from "lucide-react";

export const paymentMethods = [
  {
    id: "sslcommerz",
    label: "SSLCommerz",
    description: "Pay with card, bKash, Nagad, Rocket or internet banking",
    icon: CreditCard,
  },
];

function PaymentMethodSelector({ selectedMethod, onSelect }) {
  return (
    <nav className="vpp-methods" aria-label="Payment methods">
      <div className="vpp-methods-heading">
        <span>Payment options</span>
        <small>Select one method</small>
      </div>

      {paymentMethods.map(({ id, label, description, icon: Icon }) => {
        const isSelected = selectedMethod === id;

        return (
          <button
            key={id}
            type="button"
            className={`vpp-method ${isSelected ? "vpp-method-selected" : ""}`}
            onClick={() => onSelect(id)}
            aria-pressed={isSelected}
          >
            <span className="vpp-method-icon">
              <Icon size={20} />
            </span>
            <span className="vpp-method-copy">
              <strong>{label}</strong>
              <small>{description}</small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default PaymentMethodSelector;
