import { Banknote, Sparkles } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function PublicHighlightsSection({ profile, onFieldChange }) {
  return (
    <section className="vbp-card">
      <ProfileSectionHeading
        icon={Sparkles}
        title="Public highlights"
        description="These values map to the highlight cards on the Vendor Details page."
      />

      <div className="vbp-highlight-grid">
        <label className="vbp-field">
          <span>Years of experience</span>
          <input
            type="number"
            min="0"
            value={profile.yearsExperience}
            onChange={(event) => onFieldChange("yearsExperience", event.target.value)}
          />
        </label>

        <label className="vbp-field">
          <span>Events completed</span>
          <input
            type="number"
            min="0"
            value={profile.eventsCompleted}
            onChange={(event) => onFieldChange("eventsCompleted", event.target.value)}
          />
        </label>

        <label className="vbp-field vbp-price-field">
          <span>Starting price</span>
          <div className="vbp-input-with-icon">
            <Banknote size={17} />
            <input
              type="number"
              min="0"
              value={profile.startingPrice}
              onChange={(event) => onFieldChange("startingPrice", event.target.value)}
              placeholder="Enter amount in Taka"
            />
          </div>
        </label>
      </div>
    </section>
  );
}

export default PublicHighlightsSection;
