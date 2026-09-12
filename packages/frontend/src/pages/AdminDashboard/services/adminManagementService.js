import { previewCustomers, previewVendors } from "../data/adminPreviewData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const previewMode = (import.meta.env.VITE_ADMIN_MANAGEMENT_MODE || "preview") !== "api";
let customers = structuredClone(previewCustomers);
let vendors = structuredClone(previewVendors);

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
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "The request could not be completed.");
  }
  return response.status === 204 ? null : response.json();
};

const collection = (payload) =>
  Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

export const isAdminPreviewMode = () => previewMode;
export const getCustomers = async () =>
  previewMode ? structuredClone(customers) : collection(await request("/admin/customers"));
export const deleteCustomer = async (id) => {
  if (previewMode) customers = customers.filter((item) => item.id !== id);
  else await request(`/admin/customers/${id}`, { method: "DELETE" });
};
export const getVendors = async () =>
  previewMode ? structuredClone(vendors) : collection(await request("/admin/vendors"));
export const approveVendor = async (id) => {
  if (previewMode) vendors = vendors.map((item) => item.id === id ? { ...item, approvalStatus: "approved" } : item);
  else await request(`/admin/vendors/${id}/approve`, { method: "PATCH" });
};
export const deleteVendor = async (id) => {
  if (previewMode) vendors = vendors.filter((item) => item.id !== id);
  else await request(`/admin/vendors/${id}`, { method: "DELETE" });
};
