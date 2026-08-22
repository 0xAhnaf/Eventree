import { useNavigate } from "react-router-dom";
import "./CTASection.css";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section id="vendor" className="cta-section">
      <div className="cta-container">
        <p className="cta-subtitle">Start Your Journey</p>

        <h2 className="cta-title">Ready To Create Your Perfect Event?</h2>

        <p className="cta-description">
          Whether you are planning an unforgettable event or growing your event
          business, EVENTREE helps you take the next step.
        </p>

        <div className="cta-button-group">
          <button
            className="cta-btn cta-btn-primary"
            onClick={() => navigate("/browse-vendor")}
          >
            Browse Vendors
          </button>

          <button
            className="cta-btn cta-btn-secondary"
            onClick={() => navigate("/signup?role=vendor")}
          >
            Become a Vendor
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
