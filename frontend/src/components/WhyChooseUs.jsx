import "./WhyChooseUs.css"; 

function WhyChooseUs() {
  const features = [
    {
      icon: "✓",
      title: "Trusted Event Vendors",
      description:
        "Discover professional vendors with organised profiles, services, and business information.",
    },
    {
      icon: "⚡",
      title: "Easy Vendor Discovery",
      description:
        "Find the right vendor quickly using categories, search, filters, and preferences.",
    },
    {
      icon: "🔍",
      title: "Smart Comparison",
      description:
        "Compare different vendors based on services, pricing, and availability before deciding.",
    },
    {
      icon: "🔒",
      title: "Secure Booking Process",
      description:
        "Manage your booking journey through a simple and transparent platform experience.",
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description:
        "Unlock vendor contact details and communicate easily after completing payment.",
    },
    {
      icon: "📊",
      title: "Better Vendor Management",
      description:
        "Vendors can manage bookings, schedules, profiles, and business growth efficiently.",
    },
  ];

  return (
    <section className="why-section">
      <div className="why-container">
        
        {/* Heading */}
        <div className="why-header">
          <p className="why-subtitle">
            Why EVENTREE?
          </p>

          <h2 className="why-title">
            Making Event Planning Simple & Reliable
          </h2>

          <p className="why-header-desc">
            EVENTREE brings customers and professional vendors together
            through a smarter and more organised event planning experience.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="why-grid">
          {features.map((feature) => (
            <div key={feature.title} className="why-card">
              
              <div className="why-icon">
                {feature.icon}
              </div>

              <h3 className="why-card-title">
                {feature.title}
              </h3>

              <p className="why-card-desc">
                {feature.description}
              </p>
              
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

export default WhyChooseUs;