const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("eventree_token");

const request = async (path, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem("eventree_token");
    localStorage.removeItem("eventree_user");
    window.location.assign("/login");
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(
      data.message || "The notification request could not be completed.",
    );
  }

  return data;
};

export const fetchNotifications = async () => {
  const data = await request("/notifications");
  return {
    items: Array.isArray(data.notifications) ? data.notifications : [],
    unreadCount: Math.max(0, Number(data.unreadCount || 0)),
  };
};

export const fetchNotificationSummary = async () =>
  request("/notifications/summary");

export const markNotificationRead = async (id) =>
  request(`/notifications/${id}/read`, { method: "PATCH" });

export const markAllNotificationsRead = async () =>
  request("/notifications/read-all", { method: "POST" });
