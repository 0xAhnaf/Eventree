import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

function OnboardingFooter({
  currentStep,
  lastStepIndex,
  goBack,
  validateAndContinue,
  isSubmitting,
}) {
  const isFinalStep = currentStep === lastStepIndex;

  return (
    <div className="vob-form-footer">
      <div>
        {currentStep > 0 && (
          <button
            type="button"
            className="vob-back-button"
            onClick={goBack}
            disabled={isSubmitting}
          >
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
            disabled={isSubmitting}
          >
            Skip for now
          </button>
        )}

        <button
          type="submit"
          className="vob-continue-button"
          disabled={isFinalStep && isSubmitting}
        >
          {isFinalStep && isSubmitting ? (
            <>
              Saving...
              <Loader2 size={18} className="vob-spin" />
            </>
          ) : (
            <>
              {isFinalStep
                ? "Finish setup"
                : currentStep >= 2
                  ? "Save and continue"
                  : "Continue"}
              {isFinalStep ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default OnboardingFooter;