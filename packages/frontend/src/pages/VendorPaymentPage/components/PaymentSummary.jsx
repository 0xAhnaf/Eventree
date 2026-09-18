import { CheckCircle2 } from "lucide-react";
import { paymentMethods } from "./PaymentMethodSelector.jsx";

function PaymentSummary({ selectedMethod, formattedFee }) {
  const activeMethod = paymentMethods.find(
    (method) => method.id === selectedMethod,
  );
  const MethodIcon = activeMethod?.icon;

  return (
    <div className="vpp-checkout-content">
      <div className="vpp-checkout-heading">
        <div>
          <span className="vpp-eyebrow">Selected method</span>
          <h2>{activeMethod?.label || "Payment method"}</h2>
        </div>

        {MethodIcon && (
          <span className="vpp-active-method-icon">
            <MethodIcon size={25} />
          </span>
        )}
      </div>

      <div className="vpp-method-message">
        <CheckCircle2 size={21} />
        <div>
          <strong>{activeMethod?.description}</strong>
          <p>
            Your secure payment details will be collected by the payment
            gateway when backend integration is added.
          </p>
        </div>
      </div>

      <div className="vpp-order-summary">
        <h3>Payment summary</h3>

        <div className="vpp-summary-row">
          <span>Vendor registration fee</span>
          <strong>{formattedFee}</strong>
        </div>

        <div className="vpp-summary-row vpp-summary-total">
          <div>
            <span>Total payable</span>
            <small>One-time payment</small>
          </div>
          <strong>{formattedFee}</strong>
        </div>
      </div>
    </div>
  );
}

export default PaymentSummary;
