const BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("eventree_token");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const fetchFavorites = async () => {
  const response = await fetch(`${BASE_URL}/favorites`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("401 Unauthorized: Please log in again.");
    }

    throw new Error("Failed to fetch favorites");
  }

  const data = await response.json();

  return data.map((fav) => {
    const profile = fav.vendor_profile || {};

    const coverImage = profile.images?.find(
      (image) => image.image_type === "cover"
    );

    return {
      favorite_id: fav.id,
      id: profile.id,
      name: profile.business_name || "Vendor",
      image: coverImage?.image_url || "",
      category: profile.category?.name || "Vendor Service",
      location:
        profile.city || profile.full_address || "Location unavailable",
      rating: profile.rating || null,
      price:
        profile.starting_price !== null &&
        profile.starting_price !== undefined
          ? `৳${Number(profile.starting_price).toLocaleString()}`
          : "Contact for Pricing",
      verified: Boolean(profile.admin_approved_at),
      featured: false,
    };
  });
};

export const toggleFavoriteApi = async (vendorId) => {
  if (!vendorId) {
    throw new Error("Vendor ID is missing");
  }

  const response = await fetch(`${BASE_URL}/favorites/toggle`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      vendor_id: Number(vendorId),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to update favorite status"
    );
  }

  return await response.json();
};