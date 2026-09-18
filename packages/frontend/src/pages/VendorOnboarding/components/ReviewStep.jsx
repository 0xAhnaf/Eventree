import {
  Banknote,
  Building2,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

const formatPrice = (price) => {
  if (!String(price || "").trim()) {
    return "Not added";
  }
  return `৳${Number(price).toLocaleString("en-BD")}`;
};

function ReviewStep({ profile, setCurrentStep }) {
  return (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon vob-success-icon">
          <CheckCircle2 size={24} />
        </span>
        <div>
          <h2>Your required information is ready</h2>
          <p>
            Review the summary below. Optional items can still be added from
            Business Profile after setup.
          </p>
        </div>
      </div>

      <div className="vob-review-grid">
        <section className="vob-review-card vob-review-card-wide">
          <div className="vob-review-heading">
            <Building2 size={19} />
            <h3>Business information</h3>
          </div>
          <dl>
            <div>
              <dt>Business name</dt>
              <dd>{profile.businessName}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{profile.category}</dd>
            </div>
            <div className="vob-review-full-row">
              <dt>Description</dt>
              <dd>{profile.description}</dd>
            </div>
          </dl>
          <button type="button" onClick={() => setCurrentStep(0)}>
            Edit business information
          </button>
        </section>

        <section className="vob-review-card vob-review-card-wide">
          <div className="vob-review-heading">
            <MapPin size={19} />
            <h3>Location and contact</h3>
          </div>
          <dl>
            <div>
              <dt>City / area</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Full address</dt>
              <dd>{profile.fullAddress}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{profile.phone}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>{profile.website}</dd>
            </div>
            <div>
              <dt>Contact person</dt>
              <dd>{profile.managerName}</dd>
            </div>
          </dl>
          <button type="button" onClick={() => setCurrentStep(1)}>
            Edit contact details
          </button>
        </section>

        <section className="vob-review-card">
          <div className="vob-review-heading">
            <Sparkles size={19} />
            <h3>Optional highlights</h3>
          </div>
          <ul>
            <li>
              <span>Experience</span>
              <strong>
                {profile.yearsExperience
                  ? `${profile.yearsExperience} years`
                  : "Not added"}
              </strong>
            </li>
            <li>
              <span>Events completed</span>
              <strong>{profile.eventsCompleted || "Not added"}</strong>
            </li>
            <li>
              <span>Starting price</span>
              <strong>{formatPrice(profile.startingPrice)}</strong>
            </li>
            <li>
              <span>Cover image</span>
              <strong>{profile.coverImage ? "Added" : "Not added"}</strong>
            </li>
            <li>
              <span>Portfolio photos</span>
              <strong>{profile.portfolio.length}</strong>
            </li>
          </ul>
          <button type="button" onClick={() => setCurrentStep(2)}>
            Edit profile highlights
          </button>
        </section>

        <section className="vob-review-card">
          <div className="vob-review-heading">
            <Banknote size={19} />
            <h3>Optional services</h3>
          </div>
          <ul>
            <li>
              <span>Amenities</span>
              <strong>{profile.amenities.length}</strong>
            </li>
            <li>
              <span>Pricing packages</span>
              <strong>{profile.packages.length}</strong>
            </li>
          </ul>
          <button type="button" onClick={() => setCurrentStep(3)}>
            Edit services and packages
          </button>
        </section>
      </div>

      <div className="vob-ready-banner">
        <CheckCircle2 size={22} />
        <div>
          <strong>Ready to continue to your vendor dashboard</strong>
          <p>
            Your onboarding data will also appear in Dashboard → Business
            Profile.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep;
