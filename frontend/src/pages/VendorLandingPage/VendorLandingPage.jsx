import { useState } from "react";
import {
  LayoutDashboard,
  User,
  CalendarDays,
  CalendarCheck,
  Mail,
  Settings,
  LogOut,
  Bell,
  CalendarRange,
  Download,
  Wallet,
  Armchair,
  Eye,
  Contact,
} from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import StatCard from "./components/StatCard.jsx";
import RevenueChart from "./components/RevenueChart.jsx";
import UpcomingEvents from "./components/UpcomingEvents.jsx";
import BookingRequests from "./components/BookingRequests.jsx";
import "./VendorLandingPage.css";

const sidebarLinks = [
  { icon: <LayoutDashboard size={20} />, label: "Analytics", active: true },
  { icon: <User size={20} />, label: "Business Profile" },
  { icon: <CalendarDays size={20} />, label: "Bookings" },
  { icon: <CalendarCheck size={20} />, label: "Availability" },
  { icon: <Mail size={20} />, label: "Messages" },
];

const stats = [
  {
    icon: <Wallet size={20} />,
    iconVariant: "revenue",
    label: "Total Revenue",
    value: "$24,850.00",
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
  const [bellShake, setBellShake] = useState(false);

  const handleBellClick = () => {
    setBellShake(true);
    setTimeout(() => setBellShake(false), 500);
  };

  return (
    <div className="vlp-page">
      <Navbar />

      <div className="vlp-layout">
        {/* Sidebar Navigation */}
        <aside className="vlp-sidebar">
          <div className="vlp-sidebar-welcome">
            <h2 className="vlp-sidebar-title">Welcome back</h2>
            <p className="vlp-sidebar-subtitle">Manage your premium events</p>
          </div>

          <nav className="vlp-sidebar-nav">
            {sidebarLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className={`vlp-sidebar-link ${link.active ? "vlp-sidebar-link-active" : ""}`}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </nav>

          <div className="vlp-sidebar-bottom">
            <a href="#" className="vlp-sidebar-link">
              <Settings size={20} />
              Settings
            </a>
            <a href="#" className="vlp-sidebar-link">
              <LogOut size={20} />
              Logout
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="vlp-main">
          <div className="vlp-topbar">
            <button
              className={`vlp-bell-btn ${bellShake ? "vlp-bell-shake" : ""}`}
              onClick={handleBellClick}
              aria-label="Notifications"
            >
              <Bell size={22} />
            </button>
          </div>

          <div className="vlp-content">
            <header className="vlp-page-header">
              <div>
                <h1 className="vlp-page-title">Business Performance</h1>
                <p className="vlp-page-subtitle">
                  Your boutique's growth and engagement at a glance.
                </p>
              </div>

              <div className="vlp-header-actions">
                <button className="vlp-btn vlp-btn-outline">
                  <CalendarRange size={18} />
                  Last 30 Days
                </button>
                <button className="vlp-btn vlp-btn-solid">
                  <Download size={18} />
                  Export Report
                </button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="vlp-stats-grid">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Bento Grid */}
            <div className="vlp-bento-grid">
              <div className="vlp-bento-chart">
                <RevenueChart />
              </div>

              <div className="vlp-bento-events">
                <UpcomingEvents />
              </div>

              <div className="vlp-bento-bookings">
                <BookingRequests />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default VendorLandingPage;
