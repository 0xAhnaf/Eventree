import React, { useEffect, useState } from "react";
import "./VendorGallery.css";

const VendorGallery = ({ vendor }) => {
  const photos = vendor?.photos?.length ? vendor.photos : [vendor?.image];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [vendor?.id]);

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (!vendor) {
    return null;
  }

  return (
    <section className="vendor-gallery">
      <div className="vendor-banner">
        <img
          className="vendor-media"
          src={photos[currentIndex]}
          alt={`${vendor.name} ${currentIndex + 1}`}
        />

        {photos.length > 1 && (
          <>
            <button
              className="gallery-arrow gallery-arrow-left"
              onClick={showPrevious}
              aria-label="Previous photo"
            >
              &#10094;
            </button>

            <button
              className="gallery-arrow gallery-arrow-right"
              onClick={showNext}
              aria-label="Next photo"
            >
              &#10095;
            </button>
          </>
        )}

        <div className="banner-overlay">
          <div className="vendor-title">
            <h1>{vendor.name}</h1>

            <p>
              {vendor.category} • {vendor.location}
            </p>
          </div>
        </div>

        {photos.length > 1 && (
          <div className="gallery-thumbnails">
            {photos.map((photo, index) => (
              <button
                key={index}
                className={`gallery-thumbnail ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show photo ${index + 1}`}
              >
                <img src={photo} alt="" />
              </button>
            ))}
          </div>
        )}

        {photos.length > 1 && (
          <div className="gallery-counter">
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </div>
    </section>
  );
};

export default VendorGallery;
