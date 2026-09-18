import React from "react";
import "./VendorGallerySection.css";

const VendorGallerySection = ({ images = [], amenities = [] }) => {

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

          </div>
        ))}
      </div>

      {!images.length && <p>No portfolio images have been added yet.</p>}

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
          {!amenities.length && <p>No amenities have been added yet.</p>}
        </div>
      </div>
    </section>
  );
};

export default VendorGallerySection;
