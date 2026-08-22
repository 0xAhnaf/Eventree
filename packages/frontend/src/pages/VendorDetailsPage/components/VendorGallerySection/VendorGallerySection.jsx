import React, { useState } from "react";
import "./VendorGallerySection.css";

const VendorGallerySection = ({ images = [] }) => {
  const [showGallery, setShowGallery] = useState(false);

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

      {images.length > 0 ? (
        <>
          {/* Preview Gallery */}
          <div className="portfolio-grid">
            {images.slice(0, 6).map((image, index) => (
              <div className="portfolio-item" key={index}>
                <img src={image} alt={`Portfolio ${index + 1}`} />

                {index === 5 && images.length > 6 && (
                  <div className="photo-overlay">
                    +{images.length - 6} Photos
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View All Photos Button */}
          <button
            className="view-gallery-btn"
            onClick={() => setShowGallery(true)}
          >
            View All Photos
          </button>

          {/* Gallery Modal */}
          {showGallery && (
            <div
              className="gallery-modal"
              onClick={() => setShowGallery(false)}
            >
              <div
                className="gallery-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="gallery-modal-header">
                  <h3>All Photos</h3>

                  <button
                    className="gallery-close-btn"
                    onClick={() => setShowGallery(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="gallery-modal-grid">
                  {images.map((image, index) => (
                    <div className="gallery-modal-item" key={index}>
                      <img src={image} alt={`Portfolio ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No gallery photos available.</p>
      )}

      {/* Amenities - still static */}
      <div className="amenities-section">
        <h3>Key Amenities</h3>

        <div className="amenities-grid">
          {amenities.map((item, index) => (
            <div className="amenity-card" key={index}>
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
