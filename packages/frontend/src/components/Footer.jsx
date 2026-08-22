import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Brand */}
        <div>
          <h2 className="footer-brand-title">EVENTREE</h2>

          <p className="footer-brand-desc">
            A smart event vendor marketplace connecting customers with
            professional event service providers for seamless planning and
            memorable experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="footer-col-title">Quick Links</h3>

          <ul className="footer-list">
            <li>
              <a href="/#home" className="footer-link">
                Home
              </a>
            </li>

            <li>
              <Link to="/browse-vendor" className="footer-link">
                Browse Vendors
              </Link>
            </li>

            <li>
              <a href="/#categories" className="footer-link">
                Categories
              </a>
            </li>

            <li>
              <a href="/#how-it-works" className="footer-link">
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* For Users */}
        <div>
          <h3 className="footer-col-title">For Users</h3>

          <ul className="footer-list">
            <li>
              <Link to="/login" className="footer-link">
                Customer Login
              </Link>
            </li>

            <li>
              <Link to="/signup" className="footer-link">
                Register
              </Link>
            </li>

            <li>
              <a href="#" className="footer-link">
                My Bookings
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Favorites
              </a>
            </li>
          </ul>
        </div>

        {/* For Vendors */}
        <div>
          <h3 className="footer-col-title">For Vendors</h3>

          <ul className="footer-list">
            <li>
              <Link to="/signup?role=vendor" className="footer-link">
                Become a Vendor
              </Link>
            </li>

            <li>
              <Link to="/login" className="footer-link">
                Vendor Dashboard
              </Link>
            </li>

            <li>
              <a href="#" className="footer-link">
                Subscription
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">© 2026 EVENTREE. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
