import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero-section">
      {/* Background Image */}
      <div
        className="hero-bg"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3')",
        }}
      ></div>

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-content"
      >
        <p className="hero-subtitle">
          Smart Event Marketplace
        </p>

        <h1 className="hero-title">
          Plan Your Perfect Event With Trusted Vendors
        </h1>

        <p className="hero-description">
          Find, compare, and book verified event professionals in one place.
        </p>

        <div className="hero-buttons">
          <button
            className="hero-btn btn-primary"
            onClick={() => navigate("/browse-vendor")}
          >
            Browse Vendors
          </button>

          <button
            className="hero-btn btn-secondary"
            onClick={() => navigate("/signup?role=vendor")}
          >
            Become a Vendor
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;