import "./Footer.css"; 

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        {/* Brand */}
        <div>
          <h2 className="footer-brand-title">
            EVENTREE
          </h2>
          <p className="footer-brand-desc">
            A smart event vendor marketplace connecting customers with
            professional event service providers for seamless planning and
            memorable experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="footer-col-title">
            Quick Links
          </h3>
          <ul className="footer-list">
            <li>
              <a href="#" className="footer-link">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Browse Vendors
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* For Users */}
        <div>
          <h3 className="footer-col-title">
            For Users
          </h3>
          <ul className="footer-list">
            <li>
              <a href="#" className="footer-link">
                Customer Login
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Register
              </a>
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

        {/* Vendor */}
        <div>
          <h3 className="footer-col-title">
            For Vendors
          </h3>
          <ul className="footer-list">
            <li>
              <a href="#" className="footer-link">
                Become a Vendor
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Vendor Dashboard
              </a>
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
      <div className="footer-bottom">
        © 2026 EVENTREE. All rights reserved.
      </div>
      
    </footer>
  );
}

export default Footer;