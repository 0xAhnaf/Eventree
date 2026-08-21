import React from "react";
import "./VendorGallery.css";

const VendorGallery = ({vendor}) => {
  return (
    <section className="vendor-gallery">

      <div className="vendor-banner">

        <img
          src={vendor.image}
          alt="Vendor Banner"
        />


        <div className="banner-overlay">

          <div className="vendor-title">

            <h1>
              {vendor.name}
            </h1>

            <p>
              {vendor.category} • {vendor.location}
            </p>

          </div>


        </div>


      </div>

    </section>
  );
};

export default VendorGallery;