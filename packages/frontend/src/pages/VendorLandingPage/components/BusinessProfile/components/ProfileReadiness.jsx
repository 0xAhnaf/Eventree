import { BadgeCheck } from "lucide-react";

function ProfileReadiness({ completion }) {
  return (
    <section className="vbp-status-card">
      <div className="vbp-status-copy">
        <div className="vbp-status-icon">
          <BadgeCheck size={22} />
        </div>

        <div>
          <h2>Public profile readiness</h2>
          <p>
            Complete the information clients will see on your Vendor Details
            page.
          </p>
        </div>
      </div>

      <div className="vbp-completion">
        <div className="vbp-completion-label">
          <span>Profile completion</span>
          <strong>{completion}%</strong>
        </div>

        <div
          className="vbp-progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={completion}
        >
          <span style={{ width: `${completion}%` }} />
        </div>
      </div>
    </section>
  );
}

export default ProfileReadiness;
