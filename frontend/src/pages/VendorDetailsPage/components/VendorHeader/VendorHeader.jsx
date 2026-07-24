import React from "react";
import "./VendorHeader.css";

const VendorHeader = () => {
  return (
    <section className="vendor-header">

      <div className="vendor-header-container">


        <div className="vendor-info">


          <div className="verified-badge">
            ✓ Verified Vendor
          </div>


          <h1>
            Royal Moments Events
          </h1>


          <p className="vendor-category">
            Wedding Photography & Event Services
          </p>


          <div className="vendor-meta">


            <span>
              📍 Dhaka, Bangladesh
            </span>


            <span className="rating">

              ⭐ 4.9 (120 Reviews)

            </span>


          </div>


        </div>



        <div className="vendor-actions">


          <button>
            ↗ Share
          </button>


          <button>
            ♡ Save
          </button>


        </div>


      </div>

    </section>
  );
};


export default VendorHeader;