import "./JourneySection.css"; 

function JourneySection() {
  return (
    <section className="journey-section">
      <div className="journey-container">
        
        {/* Heading */}
        <div className="journey-header">
          <p className="journey-subtitle">
            Simple Experience
          </p>

          <h2 className="journey-title">
            Your Journey Begins Here
          </h2>

          <p className="journey-desc">
            Whether you are planning a special event or growing your event
            business, EVENTREE connects you with the right opportunities.
          </p>
        </div>

        {/* Two Cards */}
        <div className="journey-grid">
          
          {/* Customer */}
          <div className="journey-card-customer">
            <div className="journey-icon-customer">
              ✨
            </div>

            <h3 className="journey-card-title-customer">
              Create Your Celebration
            </h3>

            <p className="journey-card-desc-customer">
              Find trusted event vendors, compare services, check availability,
              and book everything you need for your special moments.
            </p>

            <button className="journey-btn-customer">
              Start Planning
            </button>
          </div>

          {/* Vendor */}
          <div className="journey-card-vendor">
            <div className="journey-icon-vendor">
              ⭐
            </div>

            <h3 className="journey-card-title-vendor">
              Grow Your Event Business
            </h3>

            <p className="journey-card-desc-vendor">
              Showcase your services, manage bookings, update availability,
              and connect with customers looking for professional vendors.
            </p>

            <button className="journey-btn-vendor">
              Join as Vendor
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default JourneySection;