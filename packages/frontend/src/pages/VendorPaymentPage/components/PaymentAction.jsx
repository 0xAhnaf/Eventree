import { ArrowRight, LockKeyhole } from "lucide-react";

function PaymentAction({
  formattedFee,
  isProcessing,
  hasAcceptedTerms,
  onTermsChange,
  onContinue,
}) {
  return (
    <div className="vpp-payment-action">
      <label className="vpp-terms">
        <input
          type="checkbox"
          checked={hasAcceptedTerms}
          onChange={(event) => onTermsChange(event.target.checked)}
        />
        <span>
          I agree to Eventree&apos;s Terms of Service and Vendor Policy.
        </span>
      </label>

      <button
        type="button"
        className="vpp-pay-button"
        onClick={onContinue}
        disabled={!hasAcceptedTerms || isProcessing}
      >
        <LockKeyhole size={18} />
        <span>
          {isProcessing
            ? "Preparing payment..."
            : `Proceed to Payment — ${formattedFee}`}
        </span>
        {!isProcessing && <ArrowRight size={18} />}
      </button>

      <p className="vpp-action-note">
        This frontend-only action currently continues to the vendor dashboard.
      </p>
    </div>
  );
}

export default PaymentAction;
