import "./HowItWorks.css"; // CSS ফাইলটি ইমপোর্ট করুন

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Search Vendors",
      description:
        "Explore professional vendors from different categories including catering, venues, decoration, and photography.",
    },
    {
      number: "02",
      title: "Filter & Compare",
      description:
        "Compare vendors based on category, budget, location, ratings, services, and availability.",
    },
    {
      number: "03",
      title: "Select Your Vendor",
      description:
        "Choose the vendor that matches your event requirements and preferences.",
    },
    {
      number: "04",
      title: "Checkout & Payment",
      description:
        "Complete your booking process through a secure and simple payment system.",
    },
    {
      number: "05",
      title: "Unlock Contact & Chat",
      description:
        "After payment, access vendor contact details and communicate directly through the platform.",
    },
  ];

  return (
    <section id="how-it-works" className="hiw-section">
      <div className="hiw-container">
        {/* Heading */}
        <div className="hiw-header">
          <p className="hiw-subtitle">Simple Process</p>

          <h2 className="hiw-title">How EVENTREE Works</h2>

          <p className="hiw-description">
            From discovering vendors to connecting with professionals, EVENTREE
            makes event planning simple and organised.
          </p>
        </div>

        {/* Steps */}
        <div className="hiw-grid">
          {steps.map((step, index) => (
            <div key={step.number} className="hiw-step">
              {/* Number */}
              <div className="hiw-number">{step.number}</div>

              <h3 className="hiw-step-title">{step.title}</h3>

              <p className="hiw-step-desc">{step.description}</p>

              {/* Line */}
              {index !== steps.length - 1 && <div className="hiw-line"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
