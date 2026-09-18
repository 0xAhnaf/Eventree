import { Check, ChevronRight } from "lucide-react";

function OnboardingSidebar({ steps, currentStep, progressPercentage }) {
  return (
    <aside className="vob-sidebar">
      <span className="vob-eyebrow">VENDOR SETUP</span>
      <h1>Let’s set up your business profile</h1>
      <p>
        Complete the required details once. You can manage everything later from
        your vendor dashboard.
      </p>

      <div className="vob-progress-summary">
        <div>
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <strong>{progressPercentage}%</strong>
        </div>
        <div
          className="vob-progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progressPercentage}
        >
          <span style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <ol className="vob-step-list">
        {steps.map((step, stepIndex) => {
          const isComplete = stepIndex < currentStep;
          const isActive = stepIndex === currentStep;

          return (
            <li
              className={`${isActive ? "vob-step-active" : ""} ${isComplete ? "vob-step-complete" : ""}`}
              key={step.title}
            >
              <span className="vob-step-number">
                {isComplete ? <Check size={16} /> : stepIndex + 1}
              </span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
              {isActive && <ChevronRight size={18} />}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export default OnboardingSidebar;
