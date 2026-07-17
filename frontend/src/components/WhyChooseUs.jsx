import {
  Check,
  Zap,
  Search,
  Lock,
  MessageCircle,
  BarChart3,
} from "lucide-react";

import "./WhyChooseUs.css";

function WhyChooseUs() {
  const features = [
    {
      icon: Check,
      title: "Trusted Event Vendors",
      description:
        "Discover professional vendors with organised profiles, services, and business information.",
    },
    {
      icon: Zap,
      title: "Easy Vendor Discovery",
      description:
        "Find the right vendor quickly using categories, search, filters, and preferences.",
    },
    {
      icon: Search,
      title: "Smart Comparison",
      description:
        "Compare different vendors based on services, pricing, and availability before deciding.",
    },
    {
      icon: Lock,
      title: "Secure Booking Process",
      description:
        "Manage your booking journey through a simple and transparent platform experience.",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description:
        "Unlock vendor contact details and communicate easily after completing payment.",
    },
    {
      icon: BarChart3,
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
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="why-card">

                <div className="why-icon">
                  <Icon size={24} />
                </div>

                <h3 className="why-card-title">
                  {feature.title}
                </h3>

                <p className="why-card-desc">
                  {feature.description}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;