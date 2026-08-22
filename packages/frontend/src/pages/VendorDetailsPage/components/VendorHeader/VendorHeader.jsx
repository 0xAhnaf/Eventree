import React from "react";
import "./VendorHeader.css";

const VendorHeader = ({ vendor }) => {
  return (
    <section className="vendor-header">
      <div className="vendor-header-container">
        <div className="vendor-info">
          {vendor.verified && (
            <div className="verified-badge">✓ Verified Vendor</div>
          )}

          <h1>{vendor.name}</h1>

          <p className="vendor-category">{vendor.category}</p>

          <div className="vendor-meta">
            <span>📍 {vendor.location}</span>

            <span className="rating">⭐ {vendor.rating} (120 Reviews)</span>
          </div>
        </div>

        <div className="vendor-actions">
          <button>↗ Share</button>

          <button>♡ Save</button>
        </div>
      </div>
    </section>
  );
};

export default VendorHeader;
