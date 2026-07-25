import React from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import "./AdminSidebar.css";

const AdminSidebar = () => {
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

  return (
    <aside className="admin-sidebar">

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
            className={`admin-menu-item ${
              item.active ? "active" : ""
            }`}
          >
            <span className="admin-menu-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </div>
        ))}

      </nav>



    </aside>
  );
};

export default AdminSidebar;