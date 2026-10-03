import React from "react";
import "./PricingPackages.css";

const PricingPackages = ({
  packages = [],
  selectedPackageId = "",
  onPackageSelect,
}) => {
  return (
    <section className="pricing-packages" id="packages">
      <h2>Pricing Packages</h2>

      <div className="packages-container">
        {packages.map((item) => (
          <div
            className={`package-card ${
              selectedPackageId === String(item.id) ? "selected" : ""
            }`}
            key={item.id}
          >
            <h3>{item.name}</h3>

            <h4>{item.formattedPrice}</h4>

            <ul>
              {item.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                if (typeof onPackageSelect === "function") {
                  onPackageSelect(String(item.id));
                }
              }}
            >
              {selectedPackageId === String(item.id)
                ? "Selected"
                : "Select Package"}
            </button>
          </div>
        ))}
      </div>

      {!packages.length && <p>No pricing packages have been added yet.</p>}
    </section>
  );
};

export default PricingPackages;
