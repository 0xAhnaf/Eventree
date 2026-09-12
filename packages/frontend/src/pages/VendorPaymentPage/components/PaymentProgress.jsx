import { Check } from "lucide-react";

const steps = ["Account Created", "Business Profile", "Registration Payment"];

function PaymentProgress() {
  return (
    <ol className="vpp-progress" aria-label="Vendor registration progress">
      {steps.map((step, index) => {
        const isComplete = index < steps.length - 1;
        const isCurrent = index === steps.length - 1;

        return (
          <li
            key={step}
            className={`vpp-progress-item ${
              isComplete ? "vpp-progress-item-complete" : ""
            } ${isCurrent ? "vpp-progress-item-current" : ""}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className="vpp-progress-marker">
              {isComplete ? <Check size={15} strokeWidth={3} /> : index + 1}
            </span>
            <span>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default PaymentProgress;
