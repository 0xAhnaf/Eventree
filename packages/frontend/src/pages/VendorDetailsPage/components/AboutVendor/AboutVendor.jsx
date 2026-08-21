import React from "react";
import "./AboutVendor.css";

const AboutVendor = ({vendor}) => {
  return (
    <section className="about-vendor" id="about">

      <h2>
        About This Vendor
      </h2>


      <p className="about-description">
        {vendor.description}
      </p>


      <div className="vendor-highlights">


        <div className="highlight-card">

          <h3>
            8+
          </h3>

          <p>
            Years Experience
          </p>

        </div>



        <div className="highlight-card">

          <h3>
            500+
          </h3>

          <p>
            Events Completed
          </p>

        </div>



        <div className="highlight-card">

          <h3>
            100%
          </h3>

          <p>
            Client Satisfaction
          </p>

        </div>


      </div>


    </section>
  );
};


export default AboutVendor;