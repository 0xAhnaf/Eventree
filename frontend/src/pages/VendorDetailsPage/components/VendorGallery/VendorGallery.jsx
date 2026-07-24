import React from "react";
import "./VendorGallery.css";

const VendorGallery = () => {
  return (
    <section className="vendor-gallery">

      <div className="vendor-banner">

        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3"
          alt="Vendor Banner"
        />


        <div className="banner-overlay">

          <div className="vendor-title">

            <h1>
              The Celestial Grand Hall
            </h1>

            <p>
              Premium Event Venue • Dhaka, Bangladesh
            </p>

          </div>


        </div>


      </div>

    </section>
  );
};

export default VendorGallery;