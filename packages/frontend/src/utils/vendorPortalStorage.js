export const DEMO_VENDOR_ID = 1;

export const VENDOR_BOOKINGS_STORAGE_KEY = "eventree_vendor_bookings";
export const VENDOR_AVAILABILITY_STORAGE_KEY = "eventree_vendor_availability";

export const VENDOR_BOOKINGS_UPDATED_EVENT = "eventree:vendor-bookings-updated";

export const VENDOR_AVAILABILITY_UPDATED_EVENT =
  "eventree:vendor-availability-updated";

const defaultBookings = [
  {
    id: "booking-upcoming-001",
    vendorId: DEMO_VENDOR_ID,
    vendorName: "Chateau de Versailles",
    clientId: "client-sarah",
    clientName: "Sarah Ahmed",
    clientEmail: "sarah@example.com",
    eventDate: "2026-10-12",
    eventType: "Wedding Reception",
    packageId: "premium",
    packageName: "Premium Package",
    guests: 180,
    status: "confirmed",
    createdAt: "2026-07-12T10:30:00.000Z",
    rating: null,
  },
  {
    id: "booking-upcoming-002",
    vendorId: DEMO_VENDOR_ID,
    vendorName: "Chateau de Versailles",
    clientId: "client-nabil",
    clientName: "Nabil Hasan",
    clientEmail: "nabil@example.com",
    eventDate: "2026-11-08",
    eventType: "Corporate Gala",
    packageId: "general",
    packageName: "General Package",
    guests: 95,
    status: "confirmed",
    createdAt: "2026-07-18T14:15:00.000Z",
    rating: null,
  },
  {
    id: "booking-completed-001",
    vendorId: DEMO_VENDOR_ID,
    vendorName: "Chateau de Versailles",
    clientId: "client-mahin",
    clientName: "Mahin Chowdhury",
    clientEmail: "mahin@example.com",
    eventDate: "2026-06-20",
    eventType: "Engagement Ceremony",
    packageId: "premium",
    packageName: "Premium Package",
    guests: 120,
    status: "completed",
    createdAt: "2026-04-08T09:00:00.000Z",
    rating: 4.8,
    review:
      "The venue team was organised, responsive, and made the event feel effortless.",
  },
  {
    id: "booking-completed-002",
    vendorId: DEMO_VENDOR_ID,
    vendorName: "Chateau de Versailles",
    clientId: "client-fariha",
    clientName: "Fariha Islam",
    clientEmail: "fariha@example.com",
    eventDate: "2026-05-02",
    eventType: "Birthday Celebration",
    packageId: "general",
    packageName: "General Package",
    guests: 60,
    status: "completed",
    createdAt: "2026-03-22T11:45:00.000Z",
    rating: 4.6,
    review:
      "Beautiful setup and smooth coordination throughout the celebration.",
  },
];

const defaultAvailability = {
  [DEMO_VENDOR_ID]: ["2026-10-05", "2026-10-19", "2026-10-25", "2026-11-16"],
};

const bookingStatusesThatReserveDate = new Set([
  "pending",
  "accepted",
  "confirmed",
]);

const normaliseBookingStatus = (status) =>
  String(status || "")
    .trim()
    .toLowerCase();

const getBookingActivityTime = (booking) => {
  const timestamp = booking.statusUpdatedAt || booking.createdAt || "";

  const parsedTime = new Date(timestamp).getTime();

  return Number.isNaN(parsedTime) ? 0 : parsedTime;
};

const doesBookingGroupReserveDate = (bookings = []) => {
  const normalisedBookings = bookings.map((booking) => ({
    ...booking,
    normalisedStatus: normaliseBookingStatus(booking.status),
  }));

  const hasAcceptedBooking = normalisedBookings.some((booking) =>
    ["accepted", "confirmed"].includes(booking.normalisedStatus),
  );

  if (hasAcceptedBooking) {
    return true;
  }

  const latestPendingOrRejectedBooking = normalisedBookings
    .filter((booking) =>
      ["pending", "rejected"].includes(booking.normalisedStatus),
    )
    .sort(
      (firstBooking, secondBooking) =>
        getBookingActivityTime(secondBooking) -
        getBookingActivityTime(firstBooking),
    )[0];

  return latestPendingOrRejectedBooking?.normalisedStatus === "pending";
};

const canUseBrowserStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readJson = (storageKey, fallbackValue) => {
  if (!canUseBrowserStorage()) {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
};

const writeJson = (storageKey, value) => {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
};

const dispatchPortalEvent = (eventName) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName));
};

const dispatchBookingAndAvailabilityEvents = () => {
  dispatchPortalEvent(VENDOR_BOOKINGS_UPDATED_EVENT);
  dispatchPortalEvent(VENDOR_AVAILABILITY_UPDATED_EVENT);
};

const normaliseDateList = (dates) =>
  Array.from(
    new Set(
      (Array.isArray(dates) ? dates : []).filter(
        (date) => typeof date === "string" && date.trim(),
      ),
    ),
  ).sort();

export const getAllVendorBookings = () => {
  const storedBookings = readJson(VENDOR_BOOKINGS_STORAGE_KEY, null);

  if (Array.isArray(storedBookings)) {
    return storedBookings;
  }

  writeJson(VENDOR_BOOKINGS_STORAGE_KEY, defaultBookings);

  return defaultBookings;
};

export const getVendorBookings = (vendorId = DEMO_VENDOR_ID) =>
  getAllVendorBookings().filter(
    (booking) => Number(booking.vendorId) === Number(vendorId),
  );

export const addVendorBookingRequest = (bookingRequest) => {
  const currentBookings = getAllVendorBookings();

  const sameDateBookings = currentBookings.filter(
    (booking) =>
      Number(booking.vendorId) === Number(bookingRequest.vendorId) &&
      booking.eventDate === bookingRequest.eventDate,
  );

  const alreadyReserved = doesBookingGroupReserveDate(sameDateBookings);

  if (alreadyReserved) {
    return {
      success: false,
      message:
        "This date already has an active booking request. Please select another date.",
    };
  }

  const newBooking = {
    id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "pending",
    rating: null,
    createdAt: new Date().toISOString(),
    ...bookingRequest,
  };

  const nextBookings = [newBooking, ...currentBookings];

  writeJson(VENDOR_BOOKINGS_STORAGE_KEY, nextBookings);
  dispatchBookingAndAvailabilityEvents();

  return {
    success: true,
    booking: newBooking,
  };
};

export const updateVendorBookingStatus = (bookingId, nextStatus) => {
  const allowedStatuses = new Set([
    "pending",
    "accepted",
    "rejected",
    "completed",
  ]);

  if (!allowedStatuses.has(nextStatus)) {
    return {
      success: false,
      message: "Unsupported booking status.",
    };
  }

  const currentBookings = getAllVendorBookings();

  const bookingExists = currentBookings.some(
    (booking) => booking.id === bookingId,
  );

  if (!bookingExists) {
    return {
      success: false,
      message: "Booking request was not found.",
    };
  }

  const targetBooking = currentBookings.find(
    (booking) => booking.id === bookingId,
  );

  const statusUpdatedAt = new Date().toISOString();

  const nextBookings = currentBookings.map((booking) => {
    const isTargetBooking = booking.id === bookingId;

    const isSameVendorAndDate =
      Number(booking.vendorId) === Number(targetBooking.vendorId) &&
      booking.eventDate === targetBooking.eventDate;

    const currentStatus = normaliseBookingStatus(booking.status);

    if (isTargetBooking) {
      return {
        ...booking,
        status: nextStatus,
        statusUpdatedAt,
      };
    }

    if (
      isSameVendorAndDate &&
      currentStatus === "pending" &&
      ["accepted", "rejected"].includes(nextStatus)
    ) {
      return {
        ...booking,
        status: "rejected",
        statusUpdatedAt,
      };
    }

    return booking;
  });

  writeJson(VENDOR_BOOKINGS_STORAGE_KEY, nextBookings);
  dispatchBookingAndAvailabilityEvents();

  return {
    success: true,
    booking: nextBookings.find((booking) => booking.id === bookingId),
  };
};

export const getAvailabilityMap = () => {
  const storedAvailability = readJson(VENDOR_AVAILABILITY_STORAGE_KEY, null);

  if (
    storedAvailability &&
    typeof storedAvailability === "object" &&
    !Array.isArray(storedAvailability)
  ) {
    return storedAvailability;
  }

  writeJson(VENDOR_AVAILABILITY_STORAGE_KEY, defaultAvailability);

  return defaultAvailability;
};

export const getVendorBlockedDates = (vendorId = DEMO_VENDOR_ID) => {
  const availabilityMap = getAvailabilityMap();

  return normaliseDateList(availabilityMap[vendorId] || []);
};

export const saveVendorBlockedDates = (
  vendorId = DEMO_VENDOR_ID,
  blockedDates = [],
) => {
  const availabilityMap = getAvailabilityMap();

  const nextAvailabilityMap = {
    ...availabilityMap,
    [vendorId]: normaliseDateList(blockedDates),
  };

  writeJson(VENDOR_AVAILABILITY_STORAGE_KEY, nextAvailabilityMap);

  dispatchPortalEvent(VENDOR_AVAILABILITY_UPDATED_EVENT);

  return nextAvailabilityMap[vendorId];
};

export const getVendorConfirmedBookingDates = (vendorId = DEMO_VENDOR_ID) => {
  const bookingsByDate = getVendorBookings(vendorId).reduce(
    (groupedBookings, booking) => {
      if (!booking.eventDate) {
        return groupedBookings;
      }

      if (!groupedBookings[booking.eventDate]) {
        groupedBookings[booking.eventDate] = [];
      }

      groupedBookings[booking.eventDate].push(booking);

      return groupedBookings;
    },
    {},
  );

  return normaliseDateList(
    Object.entries(bookingsByDate)
      .filter(([, bookings]) => doesBookingGroupReserveDate(bookings))
      .map(([eventDate]) => eventDate),
  );
};

export const getVendorUnavailableDates = (vendorId = DEMO_VENDOR_ID) =>
  normaliseDateList([
    ...getVendorBlockedDates(vendorId),
    ...getVendorConfirmedBookingDates(vendorId),
  ]);
