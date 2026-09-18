import { Globe2, Mail, MapPin, Phone, UserRound } from "lucide-react";

function ContactStep({ profile, errors, updateField }) {
  const renderFieldError = (fieldName) =>
    errors[fieldName] ? (
      <span className="vob-field-error">{errors[fieldName]}</span>
    ) : null;

  return (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon">
          <MapPin size={23} />
        </span>
        <div>
          <h2>Add your location and contact details</h2>
          <p>
            All fields in this step are required. You can edit them later from
            Business Profile.
          </p>
        </div>
      </div>

      <div className="vob-field-grid">
        <label className="vob-field">
          <span>
            City / area <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.location ? "vob-input-invalid" : ""}`}
          >
            <MapPin size={17} />
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Example: Dhaka, BD"
              autoComplete="address-level2"
            />
          </div>
          {renderFieldError("location")}
        </label>

        <label className="vob-field">
          <span>
            Full address <b>*</b>
          </span>
          <input
            className={errors.fullAddress ? "vob-input-invalid" : ""}
            type="text"
            value={profile.fullAddress}
            onChange={(e) => updateField("fullAddress", e.target.value)}
            placeholder="Enter your business address"
            autoComplete="street-address"
          />
          {renderFieldError("fullAddress")}
        </label>

        <label className="vob-field">
          <span>
            Business email <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.email ? "vob-input-invalid" : ""}`}
          >
            <Mail size={17} />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="business@example.com"
              autoComplete="email"
            />
          </div>
          {renderFieldError("email")}
        </label>

        <label className="vob-field">
          <span>
            Phone number <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.phone ? "vob-input-invalid" : ""}`}
          >
            <Phone size={17} />
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+880 1XXXXXXXXX"
              autoComplete="tel"
            />
          </div>
          {renderFieldError("phone")}
        </label>

        <label className="vob-field">
          <span>
            Website <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.website ? "vob-input-invalid" : ""}`}
          >
            <Globe2 size={17} />
            <input
              type="url"
              value={profile.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://yourwebsite.com"
              autoComplete="url"
            />
          </div>
          {renderFieldError("website")}
        </label>

        <label className="vob-field">
          <span>
            Manager / contact person <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.managerName ? "vob-input-invalid" : ""}`}
          >
            <UserRound size={17} />
            <input
              type="text"
              value={profile.managerName}
              onChange={(e) => updateField("managerName", e.target.value)}
              placeholder="Enter contact person name"
              autoComplete="name"
            />
          </div>
          {renderFieldError("managerName")}
        </label>
      </div>
    </div>
  );
}

export default ContactStep;
