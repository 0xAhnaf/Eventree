const API_BASE = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("eventree_token");

const getFirstValidationError = (errors = {}) =>
  Object.values(errors).flat().find(Boolean);

const request = async (path, options = {}) => {
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${getToken()}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      getFirstValidationError(data.errors) ||
        data.message ||
        "The message request could not be completed.",
    );
  }

  return data;
};

export const fetchCustomerConversation = async (vendorId) =>
  request(`/messages/vendors/${vendorId}`);

export const sendCustomerMessage = async (vendorId, body) =>
  request(`/messages/vendors/${vendorId}`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });

export const fetchVendorConversations = async () => {
  const data = await request("/vendor/messages");
  return Array.isArray(data.conversations) ? data.conversations : [];
};

export const fetchVendorConversation = async (customerId) =>
  request(`/vendor/messages/${customerId}`);

export const sendVendorMessage = async (customerId, body) =>
  request(`/vendor/messages/${customerId}`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
