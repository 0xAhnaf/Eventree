import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Camera,
  Check,
  Banknote,
  Globe2,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  X,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext.jsx";
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
  coverImage: "",
  portfolio: [],
  amenities: [],
  packages: [],
});

const mapBackendProfileToFrontend = (vendorProfile) => {
  const images = Array.isArray(vendorProfile.images) ? vendorProfile.images : [];
  const cover = images.find((img) => img.image_type === "cover");
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
  const { user } = useAuth();
  const [profile, setProfile] = useState(createEmptyProfile);
  const [isLoading, setIsLoading] = useState(true);
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed.");
      const data = await response.json();
      updateField("coverImage", data.image.image_url);
    } catch {
      setErrorMessage("The selected cover image could not be uploaded.");
    }

    event.target.value = "";
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Delete failed.");

      setProfile((currentProfile) => ({
        ...currentProfile,
        portfolio: currentProfile.portfolio.filter((item) => item.id !== imageId),
      }));
    } catch {
      setErrorMessage("That image could not be removed. Please try again.");
    }
  };

  const addAmenity = () => {
    const newAmenity = amenityInput.trim();

    if (!newAmenity) {
      return;
    }

    const alreadyExists = profile.amenities.some(
      (amenity) => amenity.toLowerCase() === newAmenity.toLowerCase(),
    );

    if (alreadyExists) {
      setAmenityInput("");
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      amenities: [...currentProfile.amenities, newAmenity],
    }));
    setAmenityInput("");
    setSaveMessage("");
    setErrorMessage("");
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
      {errorMessage && (
        <div className="vbp-error-banner" style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 500
        }}>
          <AlertCircle size={20} color="#dc2626" />
          <span>{errorMessage}</span>
        </div>
      )}

      <section className="vbp-status-card">
        <div className="vbp-status-copy">
          <div className="vbp-status-icon">
            <BadgeCheck size={22} />
          </div>

          <div>
            <h2>Public profile readiness</h2>
            <p>
              Complete the information clients will see on your Vendor Details
              page.
            </p>
          </div>
        </div>

        <div className="vbp-completion">
          <div className="vbp-completion-label">
            <span>Profile completion</span>
            <strong>{profileCompletion}%</strong>
          </div>

          <div
            className="vbp-progress-track"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={profileCompletion}
          >
            <span style={{ width: `${profileCompletion}%` }} />
          </div>
        </div>
      </section>

      <div className="vbp-main-grid">
        <div className="vbp-main-column">
          <section className="vbp-card">
            <div className="vbp-section-heading">
              <span className="vbp-section-icon">
                <Building2 size={20} />
              </span>

              <div>
                <h2>Business information</h2>
                <p>
                  These details appear in the vendor banner, header, and About
                  section.
                </p>
              </div>
            </div>

            <div className="vbp-field-grid">
              <label className="vbp-field">
                <span>Business name</span>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                  placeholder="Enter business name"
                />
              </label>

              <label className="vbp-field">
                <span>Vendor category</span>
                <select
                  value={profile.categoryId}
                  onChange={(event) =>
                    updateField("categoryId", event.target.value)
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="vbp-field vbp-field-full">
                <span>Business description</span>
                <textarea
                  rows="5"
                  value={profile.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe your services, style, and experience"
                />
                <small>{profile.description.length}/600 characters</small>
              </label>
            </div>
          </section>

          <section className="vbp-card">
            <div className="vbp-section-heading">
              <span className="vbp-section-icon">
                <MapPin size={20} />
              </span>

              <div>
                <h2>Location and contact</h2>
                <p>
                  Contact information will later support booking and client
                  communication.
                </p>
              </div>
            </div>

            <div className="vbp-field-grid">
              <label className="vbp-field">
                <span>City / area</span>
                <div className="vbp-input-with-icon">
                  <MapPin size={17} />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="Example: Dhaka, BD"
                  />
                </div>
              </label>

              <label className="vbp-field">
                <span>Full address</span>
                <input
                  type="text"
                  value={profile.fullAddress}
                  onChange={(event) =>
                    updateField("fullAddress", event.target.value)
                  }
                  placeholder="Enter business address"
                />
              </label>

              <label className="vbp-field">
                <span>Business email</span>
                <div className="vbp-input-with-icon">
                  <Mail size={17} />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="business@example.com"
                  />
                </div>
              </label>

              <label className="vbp-field">
                <span>Phone number</span>
                <div className="vbp-input-with-icon">
                  <Phone size={17} />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </label>

              <label className="vbp-field">
                <span>Website</span>
                <div className="vbp-input-with-icon">
                  <Globe2 size={17} />
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(event) =>
                      updateField("website", event.target.value)
                    }
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </label>

              <label className="vbp-field">
                <span>Manager / contact person</span>
                <div className="vbp-input-with-icon">
                  <UserRound size={17} />
                  <input
                    type="text"
                    value={profile.managerName}
                    onChange={(event) =>
                      updateField("managerName", event.target.value)
                    }
                    placeholder="Enter manager name"
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="vbp-card">
            <div className="vbp-section-heading">
              <span className="vbp-section-icon">
                <Sparkles size={20} />
              </span>

              <div>
                <h2>Public highlights</h2>
                <p>
                  These values map to the highlight cards on the Vendor Details
                  page.
                </p>
              </div>
            </div>

            <div className="vbp-highlight-grid">
              <label className="vbp-field">
                <span>Years of experience</span>
                <input
                  type="number"
                  min="0"
                  value={profile.yearsExperience}
                  onChange={(event) =>
                    updateField("yearsExperience", event.target.value)
                  }
                />
              </label>

              <label className="vbp-field">
                <span>Events completed</span>
                <input
                  type="number"
                  min="0"
                  value={profile.eventsCompleted}
                  onChange={(event) =>
                    updateField("eventsCompleted", event.target.value)
                  }
                />
              </label>

              <label className="vbp-field vbp-price-field">
                <span>Starting price</span>
                <div className="vbp-input-with-icon">
                  <Banknote size={17} />
                  <input
                    type="number"
                    min="0"
                    value={profile.startingPrice}
                    onChange={(event) =>
                      updateField("startingPrice", event.target.value)
                    }
                    placeholder="Enter amount in Taka"
                  />
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="vbp-side-column">
          <section className="vbp-card vbp-preview-card">
            <div className="vbp-preview-label">
              <span>Public preview</span>
              <span className="vbp-draft-badge">Draft</span>
            </div>

            <div className="vbp-preview-banner">
              {profile.coverImage ? (
                <img src={profile.coverImage} alt="Business cover preview" />
              ) : (
                <div className="vbp-empty-cover">
                  <Camera size={30} />
                  <span>Add a cover image</span>
                </div>
              )}

              <div className="vbp-preview-overlay" />

              <div className="vbp-preview-copy">
                <h3>{profile.businessName || "Your business name"}</h3>
                <p>
                  {selectedCategoryName || "Vendor category"} ·{` `}
                  {profile.location || "Location"}
                </p>
              </div>
            </div>

            <div className="vbp-preview-meta">
              <div>
                <span>Starting from</span>
                <strong>{formattedStartingPrice}</strong>
              </div>

              <span className="vbp-preview-verified">
                <Check size={15} />
                Vendor profile
              </span>
            </div>
          </section>

          <section className="vbp-card vbp-cover-card">
            <div className="vbp-section-heading vbp-section-heading-compact">
              <span className="vbp-section-icon">
                <Camera size={20} />
              </span>

              <div>
                <h2>Cover image</h2>
                <p>Recommended ratio: 16:6</p>
              </div>
            </div>

            <label className="vbp-upload-button">
              <Upload size={17} />
              Replace cover image
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
              />
            </label>

            <p className="vbp-upload-note">
              Cover image changes upload immediately.
            </p>
          </section>
        </aside>
      </div>

      <section className="vbp-card">
        <div className="vbp-section-heading vbp-section-heading-with-action">
          <div className="vbp-heading-group">
            <span className="vbp-section-icon">
              <ImagePlus size={20} />
            </span>

            <div>
              <h2>Portfolio gallery</h2>
              <p>
                Add portfolio images for the public Vendor Portfolio section.
                There is no fixed image-count limit in this frontend form.
              </p>
            </div>
          </div>

          <span className="vbp-count-badge">
            {profile.portfolio.length} images
          </span>
        </div>

        <div className="vbp-portfolio-grid">
          {profile.portfolio.map((image, imageIndex) => (
            <div className="vbp-portfolio-item" key={image.id}>
              <img src={image.url} alt={`Portfolio preview ${imageIndex + 1}`} />

              <button
                type="button"
                aria-label={`Remove portfolio image ${imageIndex + 1}`}
                onClick={() => removePortfolioImage(image.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <label className="vbp-portfolio-upload">
            <ImagePlus size={26} />
            <strong>Add photos</strong>
            <span>JPG, PNG or WEBP</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePortfolioUpload}
            />
          </label>
        </div>
      </section>

      <section className="vbp-card">
        <div className="vbp-section-heading">
          <span className="vbp-section-icon">
            <Check size={20} />
          </span>

          <div>
            <h2>Key amenities and services</h2>
            <p>
              These appear beneath the portfolio gallery on the public vendor
              page.
            </p>
          </div>
        </div>

        <div className="vbp-amenity-add">
          <input
            type="text"
            value={amenityInput}
            onChange={(event) => setAmenityInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addAmenity();
              }
            }}
            placeholder="Example: On-site parking"
          />

          <button type="button" onClick={addAmenity}>
            <Plus size={17} />
            Add amenity
          </button>
        </div>

        <div className="vbp-amenity-list">
          {profile.amenities.map((amenity) => (
            <span className="vbp-amenity-chip" key={amenity}>
              <Check size={15} />
              {amenity}
              <button
                type="button"
                aria-label={`Remove ${amenity}`}
                onClick={() => removeAmenity(amenity)}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </section>

      <section className="vbp-card">
        <div className="vbp-section-heading vbp-section-heading-with-action">
          <div className="vbp-heading-group">
            <span className="vbp-section-icon">
              <Banknote size={20} />
            </span>

            <div>
              <h2>Pricing packages</h2>
              <p>
                Maintain up to three package names, prices, and feature lists
                for future public display.
              </p>
            </div>
          </div>

          {profile.packages.length < 3 ? (
            <button
              type="button"
              className="vbp-add-package"
              onClick={addPackage}
            >
              <Plus size={17} />
              Add package ({profile.packages.length}/3)
            </button>
          ) : (
            <span className="vbp-count-badge">3/3 packages</span>
          )}
        </div>

        <div className="vbp-package-grid">
          {profile.packages.map((packageItem, packageIndex) => (
            <article className="vbp-package-card" key={packageItem.id}>
              <div className="vbp-package-header">
                <span>Package {packageIndex + 1}</span>

                {profile.packages.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Remove package ${packageIndex + 1}`}
                    onClick={() => removePackage(packageIndex)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <label className="vbp-field">
                <span>Package name</span>
                <input
                  type="text"
                  value={packageItem.name}
                  onChange={(event) =>
                    updatePackage(packageIndex, "name", event.target.value)
                  }
                />
              </label>

              <label className="vbp-field">
                <span>Package price</span>
                <input
                  type="number"
                  min="0"
                  value={packageItem.price}
                  onChange={(event) =>
                    updatePackage(packageIndex, "price", event.target.value)
                  }
                  placeholder="Amount in Taka"
                />
              </label>

              <label className="vbp-field">
                <span>Package features</span>
                <textarea
                  rows="6"
                  value={packageItem.features.join("\n")}
                  onChange={(event) =>
                    updatePackageFeatures(packageIndex, event.target.value)
                  }
                  placeholder="Write one feature per line"
                />
                <small>Write one feature per line.</small>
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className="vbp-save-bar">
        <div>
          <strong>Ready to save your profile?</strong>
          <p>
            Amenities and packages save when you click Save. Images and cover
            photo save immediately.
          </p>
          {saveMessage && (
            <span className="vbp-save-message">{saveMessage}</span>
          )}
        </div>

        <div className="vbp-save-actions">
          <button
            type="button"
            className="vbp-reset-button"
            onClick={resetProfile}
          >
            Discard changes
          </button>

          <button type="submit" className="vbp-save-button" disabled={isSaving}>
            <Save size={18} />
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </section>
    </form>
  );
}

export default BusinessProfile;