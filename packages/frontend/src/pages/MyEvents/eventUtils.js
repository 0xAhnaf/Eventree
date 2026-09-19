export const VENDOR_CATEGORIES = ["Caterers", "Event Venues", "Decorations", "Photography & Videography", "Event Management", "Music & Entertainment"];
export const todayLocal = () => {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
};
export const eventDateLabel = (date) => new Date(date + "T12:00:00").toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
export const money = (value) => "৳" + Number(value || 0).toLocaleString("en-BD");
export const eventFinished = (event) => Boolean(event.completed_at) || event.status === "Past";
export const vendorSearchLink = (eventId, category) => "/browse-vendor?" + new URLSearchParams({eventId: String(eventId), category}).toString();
