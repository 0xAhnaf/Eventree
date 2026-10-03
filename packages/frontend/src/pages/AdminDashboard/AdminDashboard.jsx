import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import AdminSidebar from "./components/AdminSidebar/AdminSidebar";
import DashboardHeader from "./components/DashboardHeader/DashboardHeader";

import OverviewCards from "./components/OverviewCards/OverviewCards";
import RevenueChart from "./components/RevenueChart/RevenueChart";

import VendorWatchlist from "./components/VendorWatchlist/VendorWatchlist";
import PaymentAlerts from "./components/PaymentAlerts/PaymentAlerts";
import CustomersPage from "./pages/CustomersPage/CustomersPage";
import VendorsPage from "./pages/VendorsPage/VendorsPage";
import BookingsPage from "./pages/BookingsPage/BookingsPage";
import PaymentsPage from "./pages/PaymentsPage/PaymentsPage";
import ReportsPage from "./pages/ReportsPage/ReportsPage";
import { getAdminDashboard } from "./services/adminManagementService";

import "./AdminDashboard.css";
import "./AdminModules.css";

const pageDetails = {
  "/admin": {
    title: "Dashboard Overview",
    subtitle:
      "Welcome back, Admin. Here's what's happening with EVENTREE today.",
  },
  "/admin/customers": {
    title: "Customers",
    subtitle: "Review and manage customer accounts across EVENTREE.",
  },
  "/admin/vendors": {
    title: "Vendors",
    subtitle: "Review and monitor vendors across the EVENTREE marketplace.",
  },
  "/admin/bookings": {
    title: "Bookings",
    subtitle:
      "Monitor booking requests and event activity across the platform.",
  },
  "/admin/payments": {
    title: "Payments",
    subtitle:
      "Review completed vendor registration payments and revenue.",
  },
  "/admin/reports": {
    title: "Reports & Analytics",
    subtitle: "Review platform performance and revenue analytics.",
  },
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
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
    if (location.pathname !== "/admin") return;

    setDashboardLoading(true);
    setDashboardError("");
    getAdminDashboard()
      .then(setDashboardData)
      .catch((error) => setDashboardError(error.message))
      .finally(() => setDashboardLoading(false));
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
        if (dashboardError) {
          return <div className="management-error">{dashboardError}</div>;
        }

        if (dashboardLoading || !dashboardData) {
          return <div className="management-loading">Loading dashboard...</div>;
        }

        return (
          <>
            {/* Statistics */}
            <section className="dashboard-section overview-section">
              <OverviewCards metrics={dashboardData.metrics} />
            </section>

            {/* Analytics Row */}
            <section className="dashboard-section dashboard-two-column">
              <div className="dashboard-main-card">
                <RevenueChart data={dashboardData.monthlyRevenue} />
              </div>

              <div className="dashboard-side-card">
                <PaymentAlerts payments={dashboardData.recentPayments} />
              </div>
            </section>

            {/* Vendor Watchlist */}
            <section className="dashboard-section dashboard-full-width">
              <div className="dashboard-main-card dashboard-vendor-card">
                <VendorWatchlist vendors={dashboardData.vendorWatchlist} />
              </div>
            </section>
          </>
        );

      case "/admin/users":
        return <Navigate to="/admin/customers" replace />;

      case "/admin/customers":
        return <CustomersPage />;

      case "/admin/vendors":
        return <VendorsPage />;

      case "/admin/bookings":
        return <BookingsPage />;

      case "/admin/payments":
        return <PaymentsPage />;

      case "/admin/reports":
        return <ReportsPage />;

      default:
        return <Navigate to="/admin" replace />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Fixed desktop sidebar / mobile drawer */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

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
          showSearch={false}
        />

        {renderPageContent()}
      </section>
    </div>
  );
};

export default AdminDashboard;
