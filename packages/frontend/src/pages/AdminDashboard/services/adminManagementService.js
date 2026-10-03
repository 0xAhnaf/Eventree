const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("eventree_token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (response.status === 401) {
    localStorage.removeItem("eventree_token");
    localStorage.removeItem("eventree_user");
    window.location.assign("/login");
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "The request could not be completed.");
  }
  return response.status === 204 ? null : response.json();
};

export const getAdminDashboard = async () => request("/admin/dashboard");

export const getCustomers = async () => {
  const payload = await request("/admin/customers");
  return Array.isArray(payload?.customers) ? payload.customers : [];
};

export const deleteCustomer = async (id) => {
  await request(`/admin/customers/${id}`, { method: "DELETE" });
};

export const getVendors = async () => {
  const payload = await request("/admin/vendors");
  return Array.isArray(payload?.vendors) ? payload.vendors : [];
};

export const approveVendor = async (id) => {
  return request(`/admin/vendors/${id}/approve`, { method: "PATCH" });
};

export const deleteVendor = async (id) => {
  await request(`/admin/vendors/${id}`, { method: "DELETE" });
};

export const getBookings = async () => {
  const payload = await request("/admin/bookings");
  return Array.isArray(payload?.bookings) ? payload.bookings : [];
};

export const getPayments = async () => request("/admin/payments");

export const getReports = async () => request("/admin/reports");
