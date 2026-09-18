const API_BASE = "http://127.0.0.1:8000/api";

export const VENDOR_BOOKINGS_UPDATED_EVENT =
  "eventree:vendor-bookings-api-updated";
export const VENDOR_AVAILABILITY_UPDATED_EVENT =
  "eventree:vendor-availability-api-updated";

const dispatchUpdate = (eventName) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventName));
  }
};

const getToken = () => localStorage.getItem("eventree_token");

const getFirstValidationError = (errors = {}) =>
  Object.values(errors).flat().find(Boolean);

const request = async (path, options = {}, authenticated = false) => {
  const headers = {
    Accept: "application/json",
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...options.headers,
  };

  if (authenticated) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      getFirstValidationError(data.errors) ||
        data.message ||
        "The request could not be completed.",
    );
  }

  return data;
};

export const fetchPublicVendors = async ({ availabilityDate = "" } = {}) => {
  const searchParams = new URLSearchParams();

  if (availabilityDate) {
    searchParams.set("availability_date", availabilityDate);
  }

  const query = searchParams.toString();
  const data = await request(`/vendors${query ? `?${query}` : ""}`);

  return Array.isArray(data.vendors) ? data.vendors : [];
};

export const fetchPublicVendor = async (vendorId) => {
  const data = await request(`/vendors/${vendorId}`);
  return data.vendor;
};

export const fetchPublicVendorAvailability = async (vendorId) =>
  request(`/vendors/${vendorId}/availability`);

export const createVendorBooking = async (booking) => {
  const data = await request(
    "/bookings",
    {
      method: "POST",
      body: JSON.stringify(booking),
    },
    true,
  );

  dispatchUpdate(VENDOR_BOOKINGS_UPDATED_EVENT);
  dispatchUpdate(VENDOR_AVAILABILITY_UPDATED_EVENT);

  return data;
};

export const fetchVendorBookings = async () => {
  const data = await request("/vendor/bookings", {}, true);
  return Array.isArray(data.bookings) ? data.bookings : [];
};

export const updateVendorBookingStatus = async (bookingId, status) => {
  const data = await request(
    `/vendor/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    true,
  );

  dispatchUpdate(VENDOR_BOOKINGS_UPDATED_EVENT);
  dispatchUpdate(VENDOR_AVAILABILITY_UPDATED_EVENT);

  return data.booking;
};

export const fetchVendorAvailability = async () =>
  request("/vendor/availability", {}, true);

export const saveVendorAvailability = async (blockedDates) => {
  const data = await request(
    "/vendor/availability",
    {
      method: "PUT",
      body: JSON.stringify({ blocked_dates: blockedDates }),
    },
    true,
  );

  dispatchUpdate(VENDOR_AVAILABILITY_UPDATED_EVENT);

  return data;
};

export const fetchVendorRegistrationStatus = async () =>
  request("/vendor/registration-status", {}, true);

export const completeVendorRegistrationPayment = async () =>
  request(
    "/vendor/registration-payment/complete",
    { method: "POST" },
    true,
  );
