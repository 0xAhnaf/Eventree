import React from "react";
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

const AdminSidebar = ({ isOpen = false, onClose }) => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      active: true,
    },
    {
      name: "Users",
      icon: <Users size={18} />,
    },
    {
      name: "Vendors",
      icon: <Building2 size={18} />,
    },
    {
      name: "Bookings",
      icon: <CalendarDays size={18} />,
    },
    {
      name: "Payments",
      icon: <CreditCard size={18} />,
    },
    {
      name: "Reports & Analytics",
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
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`admin-menu-item ${item.active ? "active" : ""}`}
            aria-current={item.active ? "page" : undefined}
            onClick={handleMenuItemClick}
          >
            <span className="admin-menu-icon">{item.icon}</span>

            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
