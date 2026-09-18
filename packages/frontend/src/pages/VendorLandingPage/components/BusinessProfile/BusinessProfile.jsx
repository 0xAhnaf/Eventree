import { useEffect, useMemo, useState } from "react";

import AmenitiesSection from "./components/AmenitiesSection.jsx";
import BusinessInformationSection from "./components/BusinessInformationSection.jsx";
import CoverImageCard from "./components/CoverImageCard.jsx";
import LocationContactSection from "./components/LocationContactSection.jsx";
import PortfolioGallerySection from "./components/PortfolioGallerySection.jsx";
import PricingPackagesSection from "./components/PricingPackagesSection.jsx";
import ProfileAlert from "./components/ProfileAlert.jsx";
import ProfileReadiness from "./components/ProfileReadiness.jsx";
import ProfileSaveBar from "./components/ProfileSaveBar.jsx";
import PublicHighlightsSection from "./components/PublicHighlightsSection.jsx";
import PublicPreviewCard from "./components/PublicPreviewCard.jsx";
import { getAmenitySuggestions } from "./utils/amenitySuggestions.js";
import "./BusinessProfile.css";

const API_BASE = "http://127.0.0.1:8000/api";

const createEmptyProfile = () => ({
  businessName: "",
  categoryId: "",
  description: "",
  location: "",
  fullAddress: "",
  email: "",
  phone: "",
  website: "",
  managerName: "",
  startingPrice: "",
  yearsExperience: "",
  eventsCompleted: "",
  coverImageId: null,
  coverImage: "",
  portfolio: [],
  amenities: [],
  packages: [],
});

const mapBackendProfileToFrontend = (vendorProfile) => {
  const images = Array.isArray(vendorProfile.images) ? vendorProfile.images : [];
  const selectedCover = vendorProfile.cover_image_id
    ? images.find(
        (img) => String(img.id) === String(vendorProfile.cover_image_id),
      )
    : null;
  const cover =
    selectedCover || images.find((img) => img.image_type === "cover");
  const portfolioImages = images
    .filter((img) => img.image_type === "portfolio")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return {
    businessName: vendorProfile.business_name || "",
    categoryId: vendorProfile.category_id ? String(vendorProfile.category_id) : "",
    description: vendorProfile.description || "",
    location: vendorProfile.city || "",
    fullAddress: vendorProfile.full_address || "",
    email: vendorProfile.business_email || "",
    phone: vendorProfile.phone || "",
    website: vendorProfile.website || "",
    managerName: vendorProfile.manager_name || "",
    startingPrice:
      vendorProfile.starting_price != null ? String(vendorProfile.starting_price) : "",
    yearsExperience:
      vendorProfile.years_of_experience != null
        ? String(vendorProfile.years_of_experience)
        : "",
    eventsCompleted:
      vendorProfile.events_completed != null ? String(vendorProfile.events_completed) : "",
    coverImageId: cover?.id ?? null,
    coverImage: cover?.image_url || "",
    portfolio: portfolioImages.map((img) => ({ id: img.id, url: img.image_url })),
    amenities: Array.isArray(vendorProfile.amenities)
      ? vendorProfile.amenities.map((a) => a.amenity_name)
      : [],
    packages: Array.isArray(vendorProfile.packages)
      ? vendorProfile.packages
          .slice()
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((pkg) => ({
            id: pkg.id,
            name: pkg.package_name || "",
            price: pkg.price != null ? String(pkg.price) : "",
            features: pkg.description ? pkg.description.split("\n") : [],
          }))
      : [],
  };
};

function BusinessProfile() {
  const [profile, setProfile] = useState(createEmptyProfile);
  const [, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const profileCompletion = useMemo(() => {
    const requiredValues = [
      profile.businessName,
      profile.categoryId,
      profile.description,
      profile.location,
      profile.email,
      profile.phone,
      profile.managerName,
      profile.startingPrice,
      profile.coverImage,
    ];

    let completedItems = requiredValues.filter((value) =>
      String(value || "").trim(),
    ).length;

    if (profile.portfolio.length >= 3) {
      completedItems += 1;
    }

    if (profile.amenities.length >= 3) {
      completedItems += 1;
    }

    if (profile.packages.length >= 1) {
      completedItems += 1;
    }

    return Math.round((completedItems / 12) * 100);
  }, [profile]);

  const selectedCategoryName =
    categories.find((category) => String(category.id) === String(profile.categoryId))
      ?.name || "";
  const amenitySuggestions = useMemo(
    () => getAmenitySuggestions(selectedCategoryName),
    [selectedCategoryName],
  );

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE}/vendor-categories`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchVendorProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("eventree_token");
      const response = await fetch(`${API_BASE}/vendor-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        setProfile(createEmptyProfile());
        return;
      }
      if (!response.ok) throw new Error("Failed to load profile.");

      const data = await response.json();
      setProfile(mapBackendProfileToFrontend(data.vendor_profile));
    } catch {
      setErrorMessage("Could not load your business profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  const updateField = (field, value) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
    setSaveMessage("");
    setErrorMessage("");
  };

  const handleCoverUpload = async (event) => {
    const [file] = Array.from(event.target.files || []);
    if (!file) return;

    setSaveMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("eventree_token");
      const formData = new FormData();
      formData.append("cover_image", file);

      const response = await fetch(`${API_BASE}/vendor-profile/cover-image`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Cover image upload failed.");
      }

      setProfile((currentProfile) => ({
        ...currentProfile,
        coverImageId: data.image.id,
        coverImage: data.image.image_url,
      }));
      setSaveMessage("Cover image updated successfully.");
    } catch (error) {
      setErrorMessage(
        error.message || "The selected cover image could not be uploaded.",
      );
    }

    event.target.value = "";
  };

  const selectPortfolioAsCover = async (image) => {
    setSaveMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("eventree_token");
      const response = await fetch(
        `${API_BASE}/vendor-profile/cover-image/${image.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cover image selection failed.");
      }

      setProfile((currentProfile) => ({
        ...currentProfile,
        coverImageId: data.image.id,
        coverImage: data.image.image_url,
      }));
      setSaveMessage("Gallery image selected as cover.");
    } catch (error) {
      setErrorMessage(error.message || "That image could not be set as cover.");
    }
  };

  const handlePortfolioUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) {
      event.target.value = "";
      return;
    }

    setSaveMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("eventree_token");
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("portfolio_images[]", file));

      const response = await fetch(`${API_BASE}/vendor-profile/portfolio-images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed.");
      const data = await response.json();
      const newImages = (data.images || []).map((img) => ({
        id: img.id,
        url: img.image_url,
      }));

      setProfile((currentProfile) => ({
        ...currentProfile,
        portfolio: [...currentProfile.portfolio, ...newImages],
      }));
    } catch {
      setErrorMessage("One or more portfolio images could not be uploaded.");
    }

    event.target.value = "";
  };

  const removePortfolioImage = async (imageId) => {
    try {
      const token = localStorage.getItem("eventree_token");
      const response = await fetch(`${API_BASE}/vendor-profile/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Delete failed.");
      }

      setProfile((currentProfile) => ({
        ...currentProfile,
        portfolio: currentProfile.portfolio.filter((item) => item.id !== imageId),
      }));
    } catch (error) {
      setErrorMessage(
        error.message || "That image could not be removed. Please try again.",
      );
    }
  };

  const addAmenityValue = (amenityValue) => {
    const newAmenity = amenityValue.trim();
    if (!newAmenity) return;

    setProfile((currentProfile) => ({
      ...currentProfile,
      amenities: currentProfile.amenities.some(
        (amenity) => amenity.toLowerCase() === newAmenity.toLowerCase(),
      )
        ? currentProfile.amenities
        : [...currentProfile.amenities, newAmenity],
    }));
    setSaveMessage("");
    setErrorMessage("");
  };

  const addAmenity = () => {
    addAmenityValue(amenityInput);
    setAmenityInput("");
  };

  const removeAmenity = (amenityToRemove) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      amenities: currentProfile.amenities.filter(
        (amenity) => amenity !== amenityToRemove,
      ),
    }));
    setSaveMessage("");
    setErrorMessage("");
  };

  const updatePackage = (packageIndex, field, value) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      packages: currentProfile.packages.map((packageItem, index) =>
        index === packageIndex
          ? {
              ...packageItem,
              [field]: value,
            }
          : packageItem,
      ),
    }));
    setSaveMessage("");
    setErrorMessage("");
  };

  const updatePackageFeatures = (packageIndex, value) => {
    const features = value
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean);

    updatePackage(packageIndex, "features", features);
  };

  const addPackage = () => {
    if (profile.packages.length >= 3) {
      setErrorMessage("You can add a maximum of 3 pricing packages.");
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      packages: [
        ...currentProfile.packages,
        {
          id: `package-${Date.now()}`,
          name: "New Package",
          price: "",
          features: ["Add package feature"],
        },
      ],
    }));
    setSaveMessage("");
    setErrorMessage("");
  };

  const removePackage = (packageIndex) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      packages: currentProfile.packages.filter(
        (_, index) => index !== packageIndex,
      ),
    }));
    setSaveMessage("");
    setErrorMessage("");
  };

  const resetProfile = () => {
    setAmenityInput("");
    setSaveMessage("");
    setErrorMessage("");
    fetchVendorProfile();
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSaveMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("eventree_token");

      const profileResponse = await fetch(`${API_BASE}/vendor-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_name: profile.businessName,
          category_id: profile.categoryId,
          description: profile.description,
          city: profile.location,
          full_address: profile.fullAddress,
          business_email: profile.email,
          phone: profile.phone,
          website: profile.website,
          manager_name: profile.managerName,
          years_of_experience: profile.yearsExperience || null,
          events_completed: profile.eventsCompleted || null,
          starting_price: profile.startingPrice || null,
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json().catch(() => ({}));
        if (profileResponse.status === 422 && errorData.errors?.phone) {
          throw new Error(errorData.errors.phone[0]);
        }
        throw new Error("Profile update failed. Please check your inputs (Phone Number).");
      }

      const validPackages = profile.packages
        .filter(
          (pkg) =>
            pkg.name.trim() && pkg.price !== "" && !Number.isNaN(Number(pkg.price)),
        )
        .map((pkg) => ({
          package_name: pkg.name.trim(),
          description: pkg.features.length ? pkg.features.join("\n") : null,
          price: Number(pkg.price),
        }));

      const detailsResponse = await fetch(`${API_BASE}/vendor-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amenities: profile.amenities,
          packages: validPackages,
        }),
      });

      if (!detailsResponse.ok) throw new Error("Details update failed.");

      await fetchVendorProfile();
      setSaveMessage("Business profile saved successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorMessage(
        err.message || "Something went wrong while saving your profile. Please try again.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSaving(false);
    }
  };

  const formattedStartingPrice = profile.startingPrice
    ? `৳${Number(profile.startingPrice).toLocaleString("en-BD")}`
    : "Price not added";

  return (
    <form className="vbp-profile" onSubmit={handleSave}>
      <ProfileAlert message={errorMessage} />
      <ProfileReadiness completion={profileCompletion} />

      <div className="vbp-main-grid">
        <div className="vbp-main-column">
          <BusinessInformationSection
            profile={profile}
            categories={categories}
            onFieldChange={updateField}
          />
          <LocationContactSection
            profile={profile}
            onFieldChange={updateField}
          />
          <PublicHighlightsSection
            profile={profile}
            onFieldChange={updateField}
          />
        </div>

        <aside className="vbp-side-column">
          <PublicPreviewCard
            profile={profile}
            selectedCategoryName={selectedCategoryName}
            formattedStartingPrice={formattedStartingPrice}
          />
          <CoverImageCard
            coverImage={profile.coverImage}
            onCoverUpload={handleCoverUpload}
          />
        </aside>
      </div>

      <PortfolioGallerySection
        portfolio={profile.portfolio}
        coverImageId={profile.coverImageId}
        onUpload={handlePortfolioUpload}
        onRemove={removePortfolioImage}
        onSetCover={selectPortfolioAsCover}
      />

      <AmenitiesSection
        amenities={profile.amenities}
        suggestions={amenitySuggestions}
        categoryName={selectedCategoryName}
        input={amenityInput}
        onInputChange={setAmenityInput}
        onAdd={addAmenity}
        onAddSuggestion={addAmenityValue}
        onRemove={removeAmenity}
      />

      <PricingPackagesSection
        packages={profile.packages}
        onAdd={addPackage}
        onRemove={removePackage}
        onUpdate={updatePackage}
        onUpdateFeatures={updatePackageFeatures}
      />

      <ProfileSaveBar
        isSaving={isSaving}
        saveMessage={saveMessage}
        onReset={resetProfile}
      />
    </form>
  );
}

export default BusinessProfile;
