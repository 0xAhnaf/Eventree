import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, Menu, Search } from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";
import "./DashboardHeader.css";
import { fetchNotificationSummary } from "../../../../services/notificationsApi";

const DashboardHeader = ({
  title = "Dashboard Overview",
  subtitle = "Welcome back, Admin. Here's what's happening with EVENTREE today.",
  onMenuClick,
  isSidebarOpen = false,
  showSearch = true,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [pendingVendorCount, setPendingVendorCount] = useState(0);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const refreshCount = async () => {
      try {
        const summary = await fetchNotificationSummary();
        setPendingVendorCount(
          Math.max(0, Number(summary.pendingVendorApprovalCount || 0)),
        );
      } catch {
        // Keep the admin header usable if the count request fails.
      }
    };

    refreshCount();
    const timer = window.setInterval(() => {
      if (!document.hidden) refreshCount();
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  const handleHomeNavigation = () => {
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const handleAdminLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="dashboard-header">
      {/* Left Section */}
      <div className="dashboard-header-main">
        <button
          type="button"
          className="admin-menu-toggle"
          aria-label="Open admin navigation"
          aria-controls="admin-sidebar-navigation"
          aria-expanded={isSidebarOpen}
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div className="dashboard-header-title">
          <h1>{title}</h1>

          <p>{subtitle}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="dashboard-header-actions">
        {showSearch && (
          <div className="dashboard-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search admin dashboard"
            />
          </div>
        )}

        <button
          type="button"
          className="notification-btn"
          aria-label="Open pending vendor approvals"
          onClick={() => navigate("/admin/vendors")}
        >
          <Bell size={20} />
          {pendingVendorCount > 0 && (
            <span className="notification-count">
              {pendingVendorCount > 99 ? "99+" : pendingVendorCount}
            </span>
          )}
        </button>

        <div className="admin-profile-wrapper" ref={profileMenuRef}>
          <button
            type="button"
            className="admin-profile"
            aria-label="Open admin profile menu"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((current) => !current)}
          >
            <span className="admin-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>

            <span className="admin-info">
              <span className="admin-info-name">{user?.name || "Admin"}</span>
              <span className="admin-info-brand">EVENTREE</span>
            </span>
          </button>

          {isProfileMenuOpen && (
            <div className="admin-profile-dropdown" role="menu">
              <button
                type="button"
                className="admin-profile-menu-item"
                role="menuitem"
                onClick={handleHomeNavigation}
              >
                <Home size={17} />
                <span>Home</span>
              </button>

              <button
                type="button"
                className="admin-profile-menu-item admin-profile-logout"
                role="menuitem"
                onClick={handleAdminLogout}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
