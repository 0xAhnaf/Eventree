import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/eventree-logo2.png";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar-header">
      <nav className="navbar-container">

        {/* Logo Section */}
        <a href="/#home" className="navbar-logo-link">
          <img
            src={logo}
            alt="EVENTREE Logo"
            className="navbar-logo-img"
          />

          <span className="navbar-logo-text">
            EVENTREE
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="navbar-desktop-menu">
          <a href="/#home" className="navbar-nav-link">
            Home
          </a>

          <Link to="/browse-vendor" className="navbar-nav-link">
            Browse Vendors
          </Link>

          <a href="/#categories" className="navbar-nav-link">
            Categories
          </a>

          <a href="/#how-it-works" className="navbar-nav-link">
            How It Works
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth-buttons">
          <Link to="/login" className="navbar-login-link">
            <button className="btn-outline">
              Login
            </button>
          </Link>

          <Link to="/signup" className="navbar-register-link">
            <button className="btn-outline register">
              Register
            </button>
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-links">

            <a
              href="/#home"
              className="navbar-mobile-link"
              onClick={() => setOpen(false)}
            >
              Home
            </a>

            <Link
              to="/browse-vendor"
              className="navbar-mobile-link"
              onClick={() => setOpen(false)}
            >
              Browse Vendors
            </Link>

            <a
              href="/#categories"
              className="navbar-mobile-link"
              onClick={() => setOpen(false)}
            >
              Categories
            </a>

            <a
              href="/#how-it-works"
              className="navbar-mobile-link"
              onClick={() => setOpen(false)}
            >
              How It Works
            </a>

            <Link
              to="/login"
              className="navbar-login-link"
              onClick={() => setOpen(false)}
            >
              <button className="btn-outline mobile-auth-btn">
                Login
              </button>
            </Link>

            <Link
              to="/signup"
              className="navbar-register-link"
              onClick={() => setOpen(false)}
            >
              <button className="btn-outline register mobile-auth-btn">
                Register
              </button>
            </Link>

          </div>
        </div>
      )}

    </header>
  );
}

export default Navbar;