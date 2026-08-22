export const VENDOR_PROFILE_STORAGE_KEY =
  "eventree_vendor_business_profiles_v2";
export const LEGACY_VENDOR_PROFILE_STORAGE_KEY =
  "eventree_vendor_business_profile";
export const VENDOR_ONBOARDING_STORAGE_KEY =
  "eventree_vendor_onboarding_status_v1";
export const VENDOR_ONBOARDING_DRAFT_KEY =
  "eventree_vendor_onboarding_drafts_v1";

export const VENDOR_CATEGORIES = [
  "Event Venues",
  "Caterers",
  "Decorations",
  "Photography & Videography",
  "Event Management",
  "Music & Entertainment",
];

export const REQUIRED_VENDOR_PROFILE_FIELDS = [
  "businessName",
  "category",
  "description",
  "location",
  "fullAddress",
  "email",
  "phone",
  "website",
  "managerName",
];

export const createEmptyVendorProfile = (user = null) => ({
  businessName: "",
  category: "",
  description: "",
  location: "",
  fullAddress: "",
  email: user?.email || "",
  phone: user?.phone || "",
  website: "",
  managerName: user?.name || "",
  startingPrice: "",
  yearsExperience: "",
  eventsCompleted: "",
  coverImage: "",
  portfolio: [],
  amenities: [],
  packages: [],
});

const getVendorIdentity = (user) =>
  String(user?.id || user?.email || "current-vendor");

const readStorageMap = (storageKey) => {
  try {
    const storedValue = localStorage.getItem(storageKey);
    const parsedValue = storedValue ? JSON.parse(storedValue) : {};

    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch {
    return {};
  }
};

const writeStorageMap = (storageKey, storageMap) => {
  localStorage.setItem(storageKey, JSON.stringify(storageMap));
};

const normalizePackages = (packages, fallbackPackages = []) => {
  const selectedPackages = Array.isArray(packages)
    ? packages
    : fallbackPackages;

  return selectedPackages.slice(0, 3).map((packageItem, packageIndex) => ({
    id: packageItem?.id || `package-${packageIndex + 1}`,
    name: packageItem?.name || "",
    price: String(packageItem?.price || ""),
    features: Array.isArray(packageItem?.features)
      ? packageItem.features
      : [],
  }));
};

export const normalizeVendorProfile = (profile = {}, fallbackProfile = {}) => {
  const emptyProfile = createEmptyVendorProfile();
  const safeProfile = profile && typeof profile === "object" ? profile : {};
  const safeFallback =
    fallbackProfile && typeof fallbackProfile === "object"
      ? fallbackProfile
      : {};

  return {
    ...emptyProfile,
    ...safeFallback,
    ...safeProfile,
    portfolio: Array.isArray(safeProfile.portfolio)
      ? safeProfile.portfolio
      : Array.isArray(safeFallback.portfolio)
        ? safeFallback.portfolio
        : [],
    amenities: Array.isArray(safeProfile.amenities)
      ? safeProfile.amenities
      : Array.isArray(safeFallback.amenities)
        ? safeFallback.amenities
        : [],
    packages: normalizePackages(
      safeProfile.packages,
      safeFallback.packages,
    ),
  };
};

export const loadVendorProfile = (user, fallbackProfile = {}) => {
  const vendorIdentity = getVendorIdentity(user);
  const profiles = readStorageMap(VENDOR_PROFILE_STORAGE_KEY);

  if (profiles[vendorIdentity]) {
    return normalizeVendorProfile(profiles[vendorIdentity], fallbackProfile);
  }

  try {
    const legacyProfile = localStorage.getItem(
      LEGACY_VENDOR_PROFILE_STORAGE_KEY,
    );

    if (legacyProfile) {
      return normalizeVendorProfile(JSON.parse(legacyProfile), fallbackProfile);
    }
  } catch {
    // Ignore malformed legacy data and use the supplied fallback.
  }

  return normalizeVendorProfile(fallbackProfile);
};

export const saveVendorProfile = (user, profile) => {
  const vendorIdentity = getVendorIdentity(user);
  const normalizedProfile = normalizeVendorProfile(profile);
  const profiles = readStorageMap(VENDOR_PROFILE_STORAGE_KEY);

  profiles[vendorIdentity] = normalizedProfile;
  writeStorageMap(VENDOR_PROFILE_STORAGE_KEY, profiles);

  // Keep the old single-profile key in sync while other frontend pages migrate.
  localStorage.setItem(
    LEGACY_VENDOR_PROFILE_STORAGE_KEY,
    JSON.stringify(normalizedProfile),
  );

  return normalizedProfile;
};

export const clearVendorProfile = (user) => {
  const vendorIdentity = getVendorIdentity(user);
  const profiles = readStorageMap(VENDOR_PROFILE_STORAGE_KEY);

  delete profiles[vendorIdentity];
  writeStorageMap(VENDOR_PROFILE_STORAGE_KEY, profiles);
  localStorage.removeItem(LEGACY_VENDOR_PROFILE_STORAGE_KEY);
};

export const markVendorOnboardingRequired = (user) => {
  if (!user || user.role !== "vendor") {
    return;
  }

  const vendorIdentity = getVendorIdentity(user);
  const statuses = readStorageMap(VENDOR_ONBOARDING_STORAGE_KEY);
  const profiles = readStorageMap(VENDOR_PROFILE_STORAGE_KEY);
  const drafts = readStorageMap(VENDOR_ONBOARDING_DRAFT_KEY);
  const emptyProfile = createEmptyVendorProfile(user);

  statuses[vendorIdentity] = {
    required: true,
    completed: false,
    updatedAt: new Date().toISOString(),
  };
  profiles[vendorIdentity] = emptyProfile;
  delete drafts[vendorIdentity];

  writeStorageMap(VENDOR_ONBOARDING_STORAGE_KEY, statuses);
  writeStorageMap(VENDOR_PROFILE_STORAGE_KEY, profiles);
  writeStorageMap(VENDOR_ONBOARDING_DRAFT_KEY, drafts);
  localStorage.setItem(
    LEGACY_VENDOR_PROFILE_STORAGE_KEY,
    JSON.stringify(emptyProfile),
  );
};

export const isVendorOnboardingRequired = (user) => {
  if (!user || user.role !== "vendor") {
    return false;
  }

  const vendorIdentity = getVendorIdentity(user);
  const statuses = readStorageMap(VENDOR_ONBOARDING_STORAGE_KEY);
  const localStatus = statuses[vendorIdentity];

  if (typeof localStatus?.required === "boolean") {
    return localStatus.required;
  }

  const backendCompleted =
    user?.vendor_profile?.onboarding_completed ??
    user?.vendorProfile?.onboardingCompleted ??
    user?.onboarding_completed;

  if (typeof backendCompleted === "boolean") {
    return !backendCompleted;
  }

  return false;
};

export const loadVendorOnboardingDraft = (user) => {
  const vendorIdentity = getVendorIdentity(user);
  const drafts = readStorageMap(VENDOR_ONBOARDING_DRAFT_KEY);
  const draft = drafts[vendorIdentity];

  if (!draft || typeof draft !== "object") {
    return null;
  }

  return {
    currentStep: Number.isInteger(draft.currentStep) ? draft.currentStep : 0,
    profile: normalizeVendorProfile(
      draft.profile,
      createEmptyVendorProfile(user),
    ),
  };
};

export const saveVendorOnboardingDraft = (user, profile, currentStep) => {
  const vendorIdentity = getVendorIdentity(user);
  const drafts = readStorageMap(VENDOR_ONBOARDING_DRAFT_KEY);

  drafts[vendorIdentity] = {
    currentStep,
    profile: normalizeVendorProfile(profile, createEmptyVendorProfile(user)),
    updatedAt: new Date().toISOString(),
  };

  writeStorageMap(VENDOR_ONBOARDING_DRAFT_KEY, drafts);
};

export const completeVendorOnboarding = (user, profile) => {
  const vendorIdentity = getVendorIdentity(user);
  const statuses = readStorageMap(VENDOR_ONBOARDING_STORAGE_KEY);
  const drafts = readStorageMap(VENDOR_ONBOARDING_DRAFT_KEY);
  const savedProfile = saveVendorProfile(user, profile);

  statuses[vendorIdentity] = {
    required: false,
    completed: true,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  delete drafts[vendorIdentity];
  writeStorageMap(VENDOR_ONBOARDING_STORAGE_KEY, statuses);
  writeStorageMap(VENDOR_ONBOARDING_DRAFT_KEY, drafts);

  return savedProfile;
};
