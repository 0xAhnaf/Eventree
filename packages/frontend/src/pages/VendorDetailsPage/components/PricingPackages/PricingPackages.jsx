import React from "react";
import "./PricingPackages.css";

const PricingPackages = () => {
  const packages = [
    {
      type: "General Package",
      price: "৳15,000",
      features: [
        "4 Hours Service",
        "Basic Setup",
        "Standard Support",
        "Digital Delivery",
      ],
    },

    {
      type: "Premium Package",
      price: "৳40,000",
      features: [
        "Full Day Service",
        "Premium Setup",
        "Priority Support",
        "Extra Customization",
        "Complete Package",
      ],
    },
  ];

  return (
    <section className="pricing-packages" id="packages">
      <h2>Pricing Packages</h2>

      <div className="packages-container">
        {packages.map((item, index) => (
          <div
            className={`package-card ${index === 1 ? "premium" : ""}`}
            key={index}
          >
            <h3>{item.type}</h3>

            <h4>{item.price}</h4>

            <ul>
              {item.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>

            <button>Select Package</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPackages;
