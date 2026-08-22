import { useState } from "react";
import {
  LayoutDashboard,
  User,
  CalendarDays,
  CalendarCheck,
  Mail,
  CalendarRange,
  Download,
  Wallet,
  Armchair,
  Eye,
  Contact,
  Menu,
  X,
} from "lucide-react";

import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

import StatCard from "./components/StatCard.jsx";
import RevenueChart from "./components/RevenueChart.jsx";
import UpcomingEvents from "./components/UpcomingEvents.jsx";
import BookingRequests from "./components/BookingRequests.jsx";
import BusinessProfile from "./components/BusinessProfile/BusinessProfile.jsx";
import VendorBookings from "./components/VendorBookings/VendorBookings.jsx";
import VendorAvailability from "./components/VendorAvailability/VendorAvailability.jsx";

import "./VendorLandingPage.css";

const sidebarLinks = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Analytics",
    view: "analytics",
  },
  {
    icon: <User size={20} />,
    label: "Business Profile",
    view: "business-profile",
  },
  {
    icon: <CalendarDays size={20} />,
    label: "Bookings",
    view: "bookings",
  },
  {
    icon: <CalendarCheck size={20} />,
    label: "Availability",
    view: "availability",
  },
  {
    icon: <Mail size={20} />,
    label: "Messages",
  },
];

const viewDetails = {
  analytics: {
    title: "Business Performance",
    subtitle: "Your boutique's growth and engagement at a glance.",
  },
  "business-profile": {
    title: "Business Profile",
    subtitle:
      "Manage the information clients will see on your public vendor page.",
  },
  bookings: {
    title: "Bookings",
    subtitle:
      "Review upcoming event details and ratings from completed events.",
  },
  availability: {
    title: "Availability Calendar",
    subtitle:
      "Control the dates clients can select from your public vendor page.",
  },
};

const stats = [
  {
    icon: <Wallet size={20} />,
    iconVariant: "revenue",
    label: "Total Revenue",
    value: "৳24,850.00",
    trend: "+12%",
    trendDirection: "up",
  },
  {
    icon: <Armchair size={20} />,
    iconVariant: "bookings",
    label: "Confirmed Bookings",
    value: "42",
    trend: "+5.2%",
    trendDirection: "up",
  },
  {
    icon: <Eye size={20} />,
    iconVariant: "views",
    label: "Profile Views",
    value: "1,204",
    trend: "-1.2%",
    trendDirection: "down",
  },
  {
    icon: <Contact size={20} />,
    iconVariant: "contacts",
    label: "Contact Unlocks",
    value: "89",
    trend: "+24%",
    trendDirection: "up",
  },
];

function VendorLandingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("analytics");

  const handleSidebarLinkClick = (event, link) => {
    event.preventDefault();

    if (link.view) {
      setActiveView(link.view);
    }

    setIsSidebarOpen(false);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "business-profile":
        return <BusinessProfile />;

      case "bookings":
        return <VendorBookings />;

      case "availability":
        return <VendorAvailability />;

      case "analytics":
      default:
        return (
          <>
            <div className="vlp-stats-grid">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="vlp-bento-grid">
              <div className="vlp-bento-chart">
                <RevenueChart />
              </div>

              <div className="vlp-bento-events">
                <UpcomingEvents
                  onViewCalendar={() => setActiveView("bookings")}
                />
              </div>

              <div className="vlp-bento-bookings">
                <BookingRequests />
              </div>
            </div>
          </>
        );
    }
  };

  const currentViewDetails = viewDetails[activeView] || viewDetails.analytics;

  const isAnalyticsView = activeView === "analytics";

  return (
    <div className="vlp-page">
      <Navbar />

      <div className="vlp-layout">
        {isSidebarOpen && (
          <div
            className="vlp-sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`vlp-sidebar ${isSidebarOpen ? "vlp-sidebar-open" : ""}`}
        >
          <div className="vlp-sidebar-welcome">
            <div>
              <h2 className="vlp-sidebar-title">Welcome back</h2>
              <p className="vlp-sidebar-subtitle">Manage your premium events</p>
            </div>

            <button
              type="button"
              className="vlp-sidebar-close"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="vlp-sidebar-nav">
            {sidebarLinks.map((link) => {
              const isActive = link.view === activeView;

              return (
                <a
                  key={link.label}
                  href="#"
                  className={`vlp-sidebar-link ${
                    isActive ? "vlp-sidebar-link-active" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => handleSidebarLinkClick(event, link)}
                >
                  {link.icon}
                  {link.label}
                </a>
              );
            })}
          </nav>
        </aside>

        <main className="vlp-main">
          <div className="vlp-topbar">
            <button
              type="button"
              className="vlp-menu-btn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="vlp-content">
            <header className="vlp-page-header">
              <div>
                <h1 className="vlp-page-title">{currentViewDetails.title}</h1>

                <p className="vlp-page-subtitle">
                  {currentViewDetails.subtitle}
                </p>
              </div>

              {isAnalyticsView && (
                <div className="vlp-header-actions">
                  <button type="button" className="vlp-btn vlp-btn-outline">
                    <CalendarRange size={18} />
                    Last 30 Days
                  </button>

                  <button type="button" className="vlp-btn vlp-btn-solid">
                    <Download size={18} />
                    Export Report
                  </button>
                </div>
              )}
            </header>

            {renderActiveView()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default VendorLandingPage;
