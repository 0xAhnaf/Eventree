import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchNotificationSummary,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationsApi";
import "./NotificationBell.css";

const POLL_INTERVAL = 15000;

const relativeTime = (value) => {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";

  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDestination = (notification, role) => {
  if (role === "vendor" && notification.relatedId) {
    return `/vendor?view=bookings&bookingId=${notification.relatedId}`;
  }

  if (role === "customer" && notification.relatedId) {
    return `/my-events?bookingId=${notification.relatedId}`;
  }

  return role === "vendor" ? "/vendor" : "/my-events";
};

export default function NotificationBell({ className = "" }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bellShake, setBellShake] = useState(false);

  const refreshSummary = useCallback(async () => {
    if (!user || !["customer", "vendor"].includes(user.role)) return;

    try {
      const summary = await fetchNotificationSummary();
      setUnreadCount(Math.max(0, Number(summary.unreadCount || 0)));
    } catch (requestError) {
      if (open) setError(requestError.message);
    }
  }, [open, user]);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchNotifications();
      setNotifications(result.items);
      setUnreadCount(result.unreadCount);
    } catch (requestError) {
      setError(requestError.message || "Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSummary();
    const refreshOnFocus = () => refreshSummary();
    window.addEventListener("focus", refreshOnFocus);
    const timer = window.setInterval(() => {
      if (!document.hidden) refreshSummary();
    }, POLL_INTERVAL);

    return () => {
      window.removeEventListener("focus", refreshOnFocus);
      window.clearInterval(timer);
    };
  }, [refreshSummary]);

  useEffect(() => {
    if (!open) return undefined;

    loadNotifications();

    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, loadNotifications]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (!user || !["customer", "vendor"].includes(user.role)) return null;

  const handleToggle = () => {
    setBellShake(true);
    window.setTimeout(() => setBellShake(false), 500);
    setOpen((current) => !current);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationRead(notification.id);
        setNotifications((items) =>
          items.map((item) =>
            item.id === notification.id ? { ...item, read: true } : item,
          ),
        );
        setUnreadCount((current) => Math.max(0, current - 1));
      } catch (requestError) {
        setError(requestError.message);
        return;
      }
    }

    setOpen(false);
    navigate(getDestination(notification, user.role));
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;
    try {
      await markAllNotificationsRead();
      setNotifications((items) =>
        items.map((item) => ({ ...item, read: true })),
      );
      setUnreadCount(0);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className={`notification-wrapper ${className}`} ref={wrapperRef}>
      <button
        type="button"
        className={`navbar-notification-btn ${bellShake ? "navbar-notification-shake" : ""}`}
        onClick={handleToggle}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell size={21} />
        {unreadCount > 0 && (
          <span className="notification-count" aria-hidden="true">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notification-panel"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="notification-panel-header">
            <div>
              <strong>Notifications</strong>
              <span>
                {unreadCount ? `${unreadCount} unread` : "All caught up"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={!unreadCount}
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          </div>

          {error && (
            <div className="notification-error" role="alert">
              {error}
            </div>
          )}

          <div className="notification-list">
            {loading ? (
              <div className="notification-state">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-state">
                You have no notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={`notification-item ${notification.read ? "is-read" : "is-unread"}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className="notification-indicator" />
                  <span className="notification-copy">
                    <strong>
                      {notification.type === "booking_request"
                        ? "New booking request"
                        : notification.type === "booking_accepted"
                          ? "Booking accepted"
                          : notification.type === "booking_rejected"
                            ? "Booking rejected"
                            : "Notification"}
                    </strong>
                    <span>{notification.message}</span>
                    <small>{relativeTime(notification.createdAt)}</small>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
