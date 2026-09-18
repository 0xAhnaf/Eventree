import { Globe2, Mail, MapPin, Phone, UserRound } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function LocationContactSection({ profile, onFieldChange }) {
  return (
    <section className="vbp-card">
      <ProfileSectionHeading
        icon={MapPin}
        title="Location and contact"
        description="Contact information will later support booking and client communication."
      />

      <div className="vbp-field-grid">
        <label className="vbp-field">
          <span>City / area</span>
          <div className="vbp-input-with-icon">
            <MapPin size={17} />
            <input
              type="text"
              value={profile.location}
              onChange={(event) => onFieldChange("location", event.target.value)}
              placeholder="Example: Dhaka, BD"
            />
          </div>
        </label>

        <label className="vbp-field">
          <span>Full address</span>
          <input
            type="text"
            value={profile.fullAddress}
            onChange={(event) => onFieldChange("fullAddress", event.target.value)}
            placeholder="Enter business address"
          />
        </label>

        <label className="vbp-field">
          <span>Business email</span>
          <div className="vbp-input-with-icon">
            <Mail size={17} />
            <input
              type="email"
              value={profile.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
              placeholder="business@example.com"
            />
          </div>
        </label>

        <label className="vbp-field">
          <span>Phone number</span>
          <div className="vbp-input-with-icon">
            <Phone size={17} />
            <input
              type="tel"
              value={profile.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </label>

        <label className="vbp-field">
          <span>Website</span>
          <div className="vbp-input-with-icon">
            <Globe2 size={17} />
            <input
              type="url"
              value={profile.website}
              onChange={(event) => onFieldChange("website", event.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </label>

        <label className="vbp-field">
          <span>Manager / contact person</span>
          <div className="vbp-input-with-icon">
            <UserRound size={17} />
            <input
              type="text"
              value={profile.managerName}
              onChange={(event) => onFieldChange("managerName", event.target.value)}
              placeholder="Enter manager name"
            />
          </div>
        </label>
      </div>
    </section>
  );
}

export default LocationContactSection;
