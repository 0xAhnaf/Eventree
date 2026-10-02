import { useState, useEffect, useCallback, useMemo } from "react";
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
  Clock,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

import Navbar from "../../components/Navbar.jsx";
import { useSearchParams } from "react-router-dom";
import { fetchNotificationSummary } from "../../services/notificationsApi.js";
import Footer from "../../components/Footer.jsx";

import StatCard from "./components/StatCard.jsx";
import RevenueChart from "./components/RevenueChart.jsx";
import UpcomingEvents from "./components/UpcomingEvents.jsx";
import BookingRequests from "./components/BookingRequests.jsx";
import BusinessProfile from "./components/BusinessProfile/BusinessProfile.jsx";
import VendorBookings from "./components/VendorBookings/VendorBookings.jsx";
import VendorAvailability from "./components/VendorAvailability/VendorAvailability.jsx";
import VendorMessages from "./components/VendorMessages/VendorMessages.jsx";

import {
  fetchVendorDashboard,
  VENDOR_BOOKINGS_UPDATED_EVENT,
} from "../../services/vendorApi.js";
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
    view: "messages",
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
  messages: {
    title: "Messages",
    subtitle:
      "Reply to customers and keep every vendor conversation in one place.",
  },
};

function VendorLandingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("analytics");
  const [searchParams] = useSearchParams();

  const [dashboardData, setDashboardData] = useState(null);
  const [pendingBookingCount, setPendingBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await fetchVendorDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load vendor dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const requestedView = searchParams.get("view");
    if (
      [
        "analytics",
        "business-profile",
        "bookings",
        "availability",
        "messages",
      ].includes(requestedView)
    ) {
      setActiveView(requestedView);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDashboardData();

    window.addEventListener(VENDOR_BOOKINGS_UPDATED_EVENT, fetchDashboardData);
    return () => {
      window.removeEventListener(
        VENDOR_BOOKINGS_UPDATED_EVENT,
        fetchDashboardData,
      );
    };
  }, [fetchDashboardData]);

  useEffect(() => {
    const refreshPendingCount = async () => {
      try {
        const summary = await fetchNotificationSummary();
        setPendingBookingCount(
          Math.max(0, Number(summary.pendingBookingCount || 0)),
        );
      } catch {
        // Keep the dashboard usable if the lightweight count request fails.
      }
    };

    refreshPendingCount();
    const timer = window.setInterval(() => {
      if (!document.hidden) refreshPendingCount();
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  const computedStats = useMemo(() => {
    const rawStats = dashboardData?.stats;

    return [
      {
        icon: <Wallet size={20} />,
        iconVariant: "revenue",
        label: "Total Revenue",
        loading,
        value: `৳${Number(rawStats?.total_revenue ?? 0).toLocaleString(
          "en-BD",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}`,
      },
      {
        icon: <CalendarCheck size={20} />,
        iconVariant: "bookings",
        label: "Confirmed Bookings",
        loading,
        value: String(rawStats?.confirmed_bookings ?? 0),
      },
      {
        icon: <Clock size={20} />,
        iconVariant: "contacts",
        label: "Pending Requests",
        loading,
        value: String(rawStats?.pending_requests ?? 0),
      },
      {
        icon: <CheckCircle2 size={20} />,
        iconVariant: "views",
        label: "Events Completed",
        loading,
        value: String(rawStats?.events_completed ?? 0),
      },
    ];
  }, [dashboardData, loading]);

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

      case "messages":
        return <VendorMessages />;

      case "analytics":
      default:
        return (
          <>
            <div className="vlp-stats-grid">
              {computedStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="vlp-bento-grid">
              <div className="vlp-bento-chart">
                <RevenueChart
                  data={dashboardData?.revenue_chart}
                  highlightDay={dashboardData?.highlight_day}
                  loading={loading}
                />
              </div>

              <div className="vlp-bento-events">
                <UpcomingEvents
                  events={dashboardData?.upcoming_events}
                  onViewCalendar={() => setActiveView("bookings")}
                />
              </div>

              <div className="vlp-bento-bookings">
                <BookingRequests requests={dashboardData?.booking_requests} />
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
                  <span>{link.label}</span>
                  {link.view === "bookings" && pendingBookingCount > 0 && (
                    <span className="vlp-sidebar-badge">
                      {pendingBookingCount > 99 ? "99+" : pendingBookingCount}
                    </span>
                  )}
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

              {isAnalyticsView && <div className="vlp-header-actions"></div>}
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
