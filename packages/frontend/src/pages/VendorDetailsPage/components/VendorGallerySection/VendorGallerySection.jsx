import React, { useState } from "react";
import "./VendorGallerySection.css";

const VendorGallerySection = () => {
  const images = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed",

    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",

    "https://images.unsplash.com/photo-1507504031003-b417219a0fde",

    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",

    "https://images.unsplash.com/photo-1519741497674-611481863552",

    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
  ];

  const amenities = [
    "High Speed Fiber WiFi",
    "Full AV Integration & Sound System",
    "Commercial Grade Catering Kitchen",
    "Full ADA Compliance & Accessibility",
    "Valet & On Site Parking",

    "Climate Controlled Spaces",
  ];

  return (
    <section className="vendor-portfolio-section" id="gallery">
      <h2>Vendor Portfolio</h2>

      <p className="portfolio-description">
        Explore the curated experiences and memorable events hosted by this
        vendor. From elegant weddings to corporate celebrations, every event
        reflects quality and creativity.
      </p>

      <h3 className="portfolio-subtitle">Gallery</h3>

      <div className="portfolio-grid">
        {images.map((image, index) => (
          <div
            className="portfolio-item"

            key={index}
          >
            <img
              src={image}

              alt={`Portfolio ${index + 1}`}
            />

            {index === 5 && <div className="photo-overlay">+24 Photos</div>}
          </div>
        ))}
      </div>

      <button className="view-gallery-btn">View All Photos</button>

      <div className="amenities-section">
        <h3>Key Amenities</h3>

        <div className="amenities-grid">
          {amenities.map((item, index) => (
            <div
              className="amenity-card"

              key={index}
            >
              <span>✓</span>

              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorGallerySection;
