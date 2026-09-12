export const VENDOR_PAYMENT_STORAGE_KEY =
  "eventree_vendor_registration_payment_status_v1";

const getVendorIdentity = (user) =>
  String(user?.id || user?.email || "current-vendor");

const readPaymentStatuses = () => {
  try {
    const storedValue = localStorage.getItem(VENDOR_PAYMENT_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : {};

    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch {
    return {};
  }
};

const writePaymentStatuses = (statuses) => {
  localStorage.setItem(VENDOR_PAYMENT_STORAGE_KEY, JSON.stringify(statuses));
};

export const markVendorPaymentRequired = (user) => {
  if (!user || user.role !== "vendor") return;

  const vendorIdentity = getVendorIdentity(user);
  const statuses = readPaymentStatuses();

  statuses[vendorIdentity] = {
    required: true,
    completed: false,
    updatedAt: new Date().toISOString(),
  };

  writePaymentStatuses(statuses);
};

export const markVendorPaymentCompleted = (user) => {
  if (!user || user.role !== "vendor") return;

  const vendorIdentity = getVendorIdentity(user);
  const statuses = readPaymentStatuses();
  const completedAt = new Date().toISOString();

  statuses[vendorIdentity] = {
    required: false,
    completed: true,
    completedAt,
    updatedAt: completedAt,
  };

  writePaymentStatuses(statuses);
};

export const isVendorPaymentRequired = (user) => {
  if (!user || user.role !== "vendor") return false;

  const vendorIdentity = getVendorIdentity(user);
  const status = readPaymentStatuses()[vendorIdentity];

  return status?.required === true && status?.completed !== true;
};

export const isVendorPaymentCompleted = (user) => {
  if (!user || user.role !== "vendor") return false;

  const vendorIdentity = getVendorIdentity(user);
  const status = readPaymentStatuses()[vendorIdentity];

  return status?.completed === true;
};
