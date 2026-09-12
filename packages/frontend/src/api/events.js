const API_BASE = "http://127.0.0.1:8000/api";

const authHeaders = () => {
  const token = localStorage.getItem("eventree_token");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handle = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
};

export const fetchEvents = async (status = "All Events") => {
  const query = status && status !== "All Events" ? `?status=${encodeURIComponent(status)}` : "";

  const response = await fetch(`${API_BASE}/events${query}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await handle(response);
  return data.events;
};

export const createEvent = async (payload) => {
  const response = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await handle(response);
  return data.event;
};

export const updateEvent = async (id, payload) => {
  const response = await fetch(`${API_BASE}/events/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await handle(response);
  return data.event;
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_BASE}/events/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return handle(response);
};
