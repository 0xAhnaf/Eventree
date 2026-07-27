import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import AdminSidebar from "./components/AdminSidebar/AdminSidebar";
import DashboardHeader from "./components/DashboardHeader/DashboardHeader";

import OverviewCards from "./components/OverviewCards/OverviewCards";
import RevenueChart from "./components/RevenueChart/RevenueChart";

import VendorWatchlist from "./components/VendorWatchlist/VendorWatchlist";
import PaymentAlerts from "./components/PaymentAlerts/PaymentAlerts";

import "./AdminDashboard.css";

const pageDetails = {
  "/admin": {
    title: "Dashboard Overview",
    subtitle: "Welcome back, Admin. Here's what's happening with EVENTREE today.",
  },
  "/admin/users": {
    title: "Users",
    subtitle: "Manage EVENTREE client, vendor, and admin accounts.",
  },
  "/admin/vendors": {
    title: "Vendors",
    subtitle: "Review and monitor vendors across the EVENTREE marketplace.",
  },
  "/admin/bookings": {
    title: "Bookings",
    subtitle: "Monitor booking requests and event activity across the platform.",
  },
  "/admin/payments": {
    title: "Payments",
    subtitle: "Review payouts, refunds, completed payments, and failed transactions.",
  },
  "/admin/reports": {
    title: "Reports & Analytics",
    subtitle: "Review platform performance and revenue analytics.",
  },
};

const AdminModulePlaceholder = ({ title, description }) => {
  return (
    <section className="dashboard-section dashboard-full-width">
      <div className="dashboard-main-card admin-module-placeholder">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = pageDetails[location.pathname];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderPageContent = () => {
    switch (location.pathname) {
      case "/admin":
        return (
          <>
            {/* Statistics */}
            <section className="dashboard-section overview-section">
              <OverviewCards />
            </section>

            {/* Analytics Row */}
            <section className="dashboard-section dashboard-two-column">
              <div className="dashboard-main-card">
                <RevenueChart />
              </div>

              <div className="dashboard-side-card">
                <PaymentAlerts />
              </div>
            </section>

            {/* Vendor Watchlist */}
            <section className="dashboard-section dashboard-full-width">
              <div className="dashboard-main-card dashboard-vendor-card">
                <VendorWatchlist />
              </div>
            </section>
          </>
        );

      case "/admin/users":
        return (
          <AdminModulePlaceholder
            title="Users Management"
            description="The Users navigation is now connected and ready for a dedicated user-management table or backend integration."
          />
        );

      case "/admin/vendors":
        return (
          <section className="dashboard-section dashboard-full-width">
            <div className="dashboard-main-card dashboard-vendor-card">
              <VendorWatchlist />
            </div>
          </section>
        );

      case "/admin/bookings":
        return (
          <AdminModulePlaceholder
            title="Bookings Management"
            description="The Bookings navigation is now connected and ready for the detailed booking-management interface."
          />
        );

      case "/admin/payments":
        return (
          <section className="dashboard-section dashboard-full-width">
            <div className="dashboard-main-card">
              <PaymentAlerts />
            </div>
          </section>
        );

      case "/admin/reports":
        return (
          <section className="dashboard-section dashboard-full-width">
            <div className="dashboard-main-card">
              <RevenueChart />
            </div>
          </section>
        );

      default:
        return <Navigate to="/admin" replace />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Fixed desktop sidebar / mobile drawer */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {isSidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Close admin navigation"
          onClick={closeSidebar}
        />
      )}

      {/* Dashboard Content */}
      <section className="admin-dashboard-content">
        {/* Top Header */}
        <DashboardHeader
          title={currentPage?.title || pageDetails["/admin"].title}
          subtitle={currentPage?.subtitle || pageDetails["/admin"].subtitle}
          onMenuClick={openSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {renderPageContent()}
      </section>
    </div>
  );
};

export default AdminDashboard;