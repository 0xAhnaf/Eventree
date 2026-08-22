import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import logo from "../assets/eventree-logo2.png";
import "./Navbar.css";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [bellShake, setBellShake] = useState(false);

  const { user, logout } = useAuth();

  const location = useLocation();

  // Hide only admin dashboard page
  if (location.pathname === "/admin") {
    return null;
  }

  const handleBellClick = () => {
    setBellShake(true);

    setTimeout(() => setBellShake(false), 500);
  };

  const handleLogout = () => {
    logout();

    setProfileOpen(false);

    setOpen(false);
  };

  const profileMenu =
    user?.role === "vendor"
      ? [
          {
            name: "Vendor Dashboard",
            path: "/vendor",
          },

          {
            name: "Settings",
            path: "/settings",
          },
        ]
      : user?.role === "admin"
        ? [
            {
              name: "Admin Dashboard",
              path: "/admin",
            },
          ]
        : [
            {
              name: "Profile",
              path: "/profile",
            },

            {
              name: "My Events",
              path: "/my-events",
            },

            {
              name: "Favorites",
              path: "/favorites",
            },
          ];

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        {/* Logo Section */}

        <a href="/#home" className="navbar-logo-link">
          <img src={logo} alt="EVENTREE Logo" className="navbar-logo-img" />

          <span className="navbar-logo-text">EVENTREE</span>
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
          {!user ? (
            <>
              <Link to="/login" className="navbar-login-link">
                <button className="btn-outline">Login</button>
              </Link>

              <Link to="/signup" className="navbar-register-link">
                <button className="btn-outline register">Register</button>
              </Link>
            </>
          ) : (
            <div className="profile-wrapper">
              {user.role === "vendor" && (
                <button
                  type="button"

                  className={`navbar-notification-btn ${
                    bellShake ? "navbar-notification-shake" : ""
                  }`}

                  onClick={handleBellClick}

                  aria-label="Notifications"
                >
                  <Bell size={21} />
                </button>
              )}

              <button
                className={`profile-avatar ${
                  user.role === "admin" ? "admin-avatar" : ""
                }`}

                onClick={() => setProfileOpen(!profileOpen)}
              >
                {user.role === "admin"
                  ? "A"
                  : user.name.charAt(0).toUpperCase()}
              </button>

              {profileOpen && (
                <div
                  className={`profile-dropdown ${
                    user.role === "admin" ? "admin-dropdown" : ""
                  }`}
                >
                  {profileMenu.map((item, index) => (
                    <Link
                      key={index}

                      to={item.path}

                      className="profile-menu-item"

                      onClick={() => setProfileOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <button
                    className="profile-menu-item logout-button"

                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}

        <div className="navbar-mobile-actions">
          {user?.role === "vendor" && (
            <button
              type="button"

              className={`navbar-notification-btn ${
                bellShake ? "navbar-notification-shake" : ""
              }`}

              onClick={handleBellClick}

              aria-label="Notifications"
            >
              <Bell size={21} />
            </button>
          )}

          <button
            className="navbar-mobile-toggle"

            onClick={() => setOpen(!open)}

            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
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

            {!user ? (
              <>
                <Link to="/login">
                  <button className="btn-outline mobile-auth-btn">Login</button>
                </Link>

                <Link to="/signup">
                  <button className="btn-outline register mobile-auth-btn">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                {profileMenu.map((item, index) => (
                  <Link
                    key={index}

                    to={item.path}

                    className="navbar-mobile-link"
                  >
                    {item.name}
                  </Link>
                ))}

                <button
                  className="mobile-logout"

                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
