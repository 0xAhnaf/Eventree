import React from "react";
import "./AboutVendor.css";

const AboutVendor = ({ vendor }) => {
  return (
    <section className="about-vendor" id="about">
      <h2>About This Vendor</h2>

      <p className="about-description">{vendor.description}</p>

      <div className="vendor-highlights">
        <div className="highlight-card">
          <h3>{vendor.yearsExperience ?? "—"}</h3>

          <p>Years Experience</p>
        </div>

        <div className="highlight-card">
          <h3>{vendor.eventsCompleted ?? "—"}</h3>

          <p>Events Completed</p>
        </div>

        <div className="highlight-card">
          <h3>{vendor.price || "Price on request"}</h3>

          <p>Starting Price</p>
        </div>
      </div>
    </section>
  );
};

export default AboutVendor;
