import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, Heart, Menu, UserRound, X } from "lucide-react";
import "./CustomerDashboardLayout.css";

export const CUSTOMER_DASHBOARD_LINKS = [
  { label: "Favorites", path: "/favorites", icon: Heart },
  { label: "My Events", path: "/my-events", icon: CalendarDays },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export default function CustomerDashboardSidebar({
  title = "Welcome back",
  subtitle = "Plan your memorable moments",
  links = CUSTOMER_DASHBOARD_LINKS,
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="customer-dashboard-menu"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="customer-dashboard-sidebar"
      >
        <Menu size={18} /> My dashboard
      </button>

      {open && (
        <button
          type="button"
          className="customer-dashboard-scrim"
          aria-label="Close dashboard navigation"
          onClick={close}
        />
      )}

      <aside
        id="customer-dashboard-sidebar"
        className={"customer-dashboard-sidebar" + (open ? " is-open" : "")}
      >
        <div className="customer-dashboard-sidebar-heading">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button
            type="button"
            className="customer-dashboard-menu customer-dashboard-close"
            aria-label="Close dashboard navigation"
            onClick={close}
          >
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Customer dashboard">
          {links.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={close}
              className={({ isActive }) =>
                isActive
                  ? "customer-dashboard-nav is-active"
                  : "customer-dashboard-nav"
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
