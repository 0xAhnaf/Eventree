import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  CreditCard,
  BarChart3,
  X,
} from "lucide-react";

import "./AdminSidebar.css";
import { fetchNotificationSummary } from "../../../../services/notificationsApi";

const AdminSidebar = ({ isOpen = false, onClose }) => {
  const [pendingVendorCount, setPendingVendorCount] = useState(0);

  const refreshCount = useCallback(async () => {
    try {
      const summary = await fetchNotificationSummary();
      setPendingVendorCount(
        Math.max(0, Number(summary.pendingVendorApprovalCount || 0)),
      );
    } catch {
      // Navigation remains usable if the count request fails.
    }
  }, []);

  useEffect(() => {
    refreshCount();
    const timer = window.setInterval(() => {
      if (!document.hidden) refreshCount();
    }, 15000);
    return () => window.clearInterval(timer);
  }, [refreshCount]);

  const menuItems = [
    {
      name: "Dashboard",
      to: "/admin",
      icon: <LayoutDashboard size={18} />,
      end: true,
    },
    {
      name: "Customers",
      to: "/admin/customers",
      icon: <Users size={18} />,
    },
    {
      name: "Vendors",
      to: "/admin/vendors",
      icon: <Building2 size={18} />,
    },
    {
      name: "Bookings",
      to: "/admin/bookings",
      icon: <CalendarDays size={18} />,
    },
    {
      name: "Payments",
      to: "/admin/payments",
      icon: <CreditCard size={18} />,
    },
    {
      name: "Reports & Analytics",
      to: "/admin/reports",
      icon: <BarChart3 size={18} />,
    },
  ];

  const handleMenuItemClick = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <aside
      id="admin-sidebar-navigation"
      className={`admin-sidebar ${isOpen ? "admin-sidebar-open" : ""}`}
      aria-label="Admin navigation"
    >
      <button
        type="button"
        className="admin-sidebar-close"
        aria-label="Close admin navigation"
        onClick={onClose}
      >
        <X size={22} />
      </button>

      {/* Logo Section */}
      <div className="admin-logo-section">
        <h2>EVENTREE</h2>
        <p>ADMIN CONTROL</p>
      </div>

      {/* Main Navigation */}
      <nav className="admin-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
            onClick={handleMenuItemClick}
          >
            <span className="admin-menu-icon">{item.icon}</span>

            <span>{item.name}</span>
            {item.name === "Vendors" && pendingVendorCount > 0 && (
              <span className="admin-menu-badge">
                {pendingVendorCount > 99 ? "99+" : pendingVendorCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
