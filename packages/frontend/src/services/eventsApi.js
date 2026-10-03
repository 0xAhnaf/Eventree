const BASE = "http://127.0.0.1:8000/api";
async function request(path, method = "GET", body) {
  const response = await fetch(BASE + path, {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("eventree_token") || ""}` },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(Object.values(data.errors || {}).flat()[0] || data.message || "Could not complete the request.");
  return data;
}
export const listEvents = async () => (await request("/events")).events;
export const saveEvent = async (values, id) => (await request(id ? `/events/${id}` : "/events", id ? "PUT" : "POST", values)).event;
export const deleteEvent = (id) => request(`/events/${id}`, "DELETE");
export const completeEvent = async (id) => (await request(`/events/${id}/complete`, "POST")).event;
