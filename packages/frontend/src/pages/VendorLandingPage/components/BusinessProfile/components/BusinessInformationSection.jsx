import { Building2 } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function BusinessInformationSection({ profile, categories, onFieldChange }) {
  return (
    <section className="vbp-card">
      <ProfileSectionHeading
        icon={Building2}
        title="Business information"
        description="These details appear in the vendor banner, header, and About section."
      />

      <div className="vbp-field-grid">
        <label className="vbp-field">
          <span>Business name</span>
          <input
            type="text"
            value={profile.businessName}
            onChange={(event) => onFieldChange("businessName", event.target.value)}
            placeholder="Enter business name"
          />
        </label>

        <label className="vbp-field">
          <span>Vendor category</span>
          <select
            value={profile.categoryId}
            onChange={(event) => onFieldChange("categoryId", event.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="vbp-field vbp-field-full">
          <span>Business description</span>
          <textarea
            rows="5"
            value={profile.description}
            onChange={(event) => onFieldChange("description", event.target.value)}
            placeholder="Describe your services, style, and experience"
          />
          <small>{profile.description.length}/600 characters</small>
        </label>
      </div>
    </section>
  );
}

export default BusinessInformationSection;
