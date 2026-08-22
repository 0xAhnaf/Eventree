import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./ProfileSidebar.css";

const ProfileSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout");
  };

  const getNavClass = ({ isActive }) =>
    isActive ? "sidebar-link sidebar-link-active" : "sidebar-link";

  return (
    <aside className="profile-sidebar">
      <nav className="sidebar-main-links">
        <NavLink to="/favorites" className={getNavClass}>
          <span className="sidebar-icon">♡</span>
          <span>Favorites</span>
        </NavLink>

        <NavLink to="/my-events" className={getNavClass}>
          <span className="sidebar-icon">□</span>
          <span>My Events</span>
        </NavLink>

        <NavLink to="/profile" className={getNavClass}>
          <span className="sidebar-icon">●</span>
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className={getNavClass}>
          <span className="sidebar-icon">⚙</span>
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
