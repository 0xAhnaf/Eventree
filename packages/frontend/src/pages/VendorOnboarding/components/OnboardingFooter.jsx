import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

function OnboardingFooter({
  currentStep,
  lastStepIndex,
  goBack,
  validateAndContinue,
}) {
  return (
    <div className="vob-form-footer">
      <div>
        {currentStep > 0 && (
          <button type="button" className="vob-back-button" onClick={goBack}>
            <ArrowLeft size={18} />
            Back
          </button>
        )}
      </div>

      <div className="vob-forward-actions">
        {currentStep >= 2 && currentStep < lastStepIndex && (
          <button
            type="button"
            className="vob-skip-button"
            onClick={validateAndContinue}
          >
            Skip for now
          </button>
        )}

        <button type="submit" className="vob-continue-button">
          {currentStep === lastStepIndex
            ? "Finish setup"
            : currentStep >= 2
              ? "Save and continue"
              : "Continue"}
          {currentStep === lastStepIndex ? (
            <CheckCircle2 size={18} />
          ) : (
            <ArrowRight size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

export default OnboardingFooter;
