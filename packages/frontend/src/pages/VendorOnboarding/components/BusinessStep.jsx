import { Building2 } from "lucide-react";
import { VENDOR_CATEGORIES } from "../../../utils/vendorProfileStorage.js";

function BusinessStep({ profile, errors, updateField }) {
  const renderFieldError = (fieldName) =>
    errors[fieldName] ? (
      <span className="vob-field-error">{errors[fieldName]}</span>
    ) : null;

  return (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon">
          <Building2 size={23} />
        </span>
        <div>
          <h2>Tell us about your business</h2>
          <p>
            These required details will appear in your vendor banner, header,
            and About section.
          </p>
        </div>
      </div>

      <div className="vob-field-grid">
        <label className="vob-field">
          <span>
            Business name <b>*</b>
          </span>
          <input
            className={errors.businessName ? "vob-input-invalid" : ""}
            type="text"
            value={profile.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            placeholder="Enter your business name"
            autoComplete="organization"
          />
          {renderFieldError("businessName")}
        </label>

        <label className="vob-field">
          <span>
            Vendor category <b>*</b>
          </span>
          <select
            className={errors.category ? "vob-input-invalid" : ""}
            value={profile.category}
            onChange={(e) => updateField("category", e.target.value)}
          >
            <option value="">Select a vendor category</option>
            {VENDOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {renderFieldError("category")}
        </label>

        <label className="vob-field vob-field-full">
          <span>
            Business description <b>*</b>
          </span>
          <textarea
            className={errors.description ? "vob-input-invalid" : ""}
            rows="6"
            maxLength="600"
            value={profile.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe your services, style, and experience"
          />
          <div className="vob-field-meta">
            {renderFieldError("description")}
            <small>{profile.description.length}/600 characters</small>
          </div>
        </label>
      </div>
    </div>
  );
}

export default BusinessStep;
