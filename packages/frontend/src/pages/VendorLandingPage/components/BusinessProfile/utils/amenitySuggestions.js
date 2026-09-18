const CATEGORY_AMENITY_SUGGESTIONS = {
  caterers: [
    "Custom menu",
    "Buffet service",
    "Halal menu",
    "Vegetarian options",
    "Serving staff",
    "Tableware provided",
  ],
  "event venues": [
    "On-site parking",
    "Air conditioning",
    "Backup generator",
    "Bridal room",
    "Security service",
    "Wheelchair access",
  ],
  decorations: [
    "Theme decoration",
    "Floral decoration",
    "Stage design",
    "Lighting setup",
    "Custom backdrop",
    "Venue setup",
  ],
  "photography & videography": [
    "Event photography",
    "Videography",
    "Drone coverage",
    "Same-day edit",
    "Photo album",
    "Live streaming",
  ],
  "event management": [
    "Event planning",
    "Guest management",
    "Vendor coordination",
    "Timeline management",
    "On-site coordination",
    "Budget planning",
  ],
  "music & entertainment": [
    "DJ service",
    "Live music",
    "Sound system",
    "Stage lighting",
    "Emcee service",
    "Dance floor",
  ],
};

const FALLBACK_SUGGESTIONS = [
  "Custom packages",
  "Client consultation",
  "On-site service",
  "Delivery available",
];

const normalizeCategoryName = (categoryName = "") =>
  categoryName.trim().toLowerCase().replace(/\s+/g, " ");

export const getAmenitySuggestions = (categoryName) => {
  const normalizedName = normalizeCategoryName(categoryName);

  if (!normalizedName) {
    return FALLBACK_SUGGESTIONS;
  }

  if (CATEGORY_AMENITY_SUGGESTIONS[normalizedName]) {
    return CATEGORY_AMENITY_SUGGESTIONS[normalizedName];
  }

  const matchingCategory = Object.keys(CATEGORY_AMENITY_SUGGESTIONS).find(
    (category) =>
      normalizedName.includes(category) || category.includes(normalizedName),
  );

  return matchingCategory
    ? CATEGORY_AMENITY_SUGGESTIONS[matchingCategory]
    : FALLBACK_SUGGESTIONS;
};
