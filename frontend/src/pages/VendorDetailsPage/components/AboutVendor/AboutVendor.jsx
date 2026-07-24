import React from "react";
import "./AboutVendor.css";

const AboutVendor = () => {
  return (
    <section className="about-vendor" id="about">

      <h2>
        About This Vendor
      </h2>


      <p className="about-description">
        Royal Moments Events is a professional event service provider
        specializing in creating memorable experiences for weddings,
        corporate events, and special celebrations. Our team focuses on
        quality service, creative ideas, and personalized solutions for
        every client.
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