import React from "react";
import "./VendorTabs.css";

const VendorTabs = () => {
  return (
    <section className="vendor-tabs">
      <div className="vendor-tabs-container">
        <a href="#about">About</a>

        <a href="#gallery">Gallery</a>

        <a href="#packages">Packages</a>

        <a href="#availability">Availability</a>

        <a href="#reviews">Reviews</a>
      </div>
    </section>
  );
};

export default VendorTabs;
