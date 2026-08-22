import { useMemo, useState } from "react";
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
} from "lucide-react";

import vendors from "../../../../components/vendors.js";
import { useAuth } from "../../../../context/AuthContext.jsx";
import {
  clearVendorProfile,
  loadVendorProfile,
  saveVendorProfile,
  VENDOR_CATEGORIES,
} from "../../../../utils/vendorProfileStorage.js";
import "./BusinessProfile.css";

const demoVendor = vendors[0] || {};

const systemAverageReviewRating = Number(demoVendor.rating || 0);

const calculateClientSatisfaction = (averageRating) =>
  Math.min(100, Math.max(0, Math.round(Number(averageRating || 0) * 20)));

const initialProfile = {
  businessName: demoVendor.name || "",
  category: demoVendor.category || "Event Venues",
  description: demoVendor.description || "",
  location: demoVendor.location || "",
  fullAddress: "House 12, Road 7, Gulshan, Dhaka",
  email: "hello@eventreevendor.com",
  phone: "+880 1700-000002",
  website: "https://www.eventreevendor.com",
  managerName: "Ahmed Rahman",
  startingPrice: String(demoVendor.price || "").replace(/[^0-9]/g, ""),
  yearsExperience: "8",
  eventsCompleted: "500",
  coverImage: demoVendor.image || "",
  portfolio: [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
    "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    "https://images.unsplash.com/photo-1519741497674-611481863552",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
  ],
  amenities: [
    "High Speed Fiber WiFi",
    "Full AV Integration & Sound System",
    "Commercial Grade Catering Kitchen",
    "Full Accessibility Support",
    "Valet & On-site Parking",
    "Climate Controlled Spaces",
  ],
  packages: [
    {
      id: "general-package",
      name: "General Package",
      price: "15000",
      features: [
        "4 Hours Service",
        "Basic Setup",
        "Standard Support",
        "Digital Delivery",
      ],
    },
    {
      id: "premium-package",
      name: "Premium Package",
      price: "40000",
      features: [
        "Full Day Service",
        "Premium Setup",
        "Priority Support",
        "Extra Customization",
        "Complete Package",
      ],
    },
  ],
};

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

function BusinessProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() =>
    loadVendorProfile(user, initialProfile),
  );
  const [amenityInput, setAmenityInput] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const profileCompletion = useMemo(() => {
    const requiredValues = [
      profile.businessName,
      profile.category,
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

  const updateField = (field, value) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
    setSaveMessage("");
  };

  const handleCoverUpload = async (event) => {
    const [file] = Array.from(event.target.files || []);

    if (!file) {
      return;
    }

    try {
      const imagePreview = await readImageFile(file);
      updateField("coverImage", imagePreview);
    } catch {
      setSaveMessage("The selected cover image could not be loaded.");
    }

    event.target.value = "";
  };

  const handlePortfolioUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      event.target.value = "";
      return;
    }

    try {
      const newImages = await Promise.all(selectedFiles.map(readImageFile));

      setProfile((currentProfile) => ({
        ...currentProfile,
        portfolio: [...currentProfile.portfolio, ...newImages],
      }));
      setSaveMessage("");
    } catch {
      setSaveMessage("One or more portfolio images could not be loaded.");
    }

    event.target.value = "";
  };

  const removePortfolioImage = (imageIndex) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      portfolio: currentProfile.portfolio.filter(
        (_, index) => index !== imageIndex,
      ),
    }));
    setSaveMessage("");
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
  };

  const removeAmenity = (amenityToRemove) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      amenities: currentProfile.amenities.filter(
        (amenity) => amenity !== amenityToRemove,
      ),
    }));
    setSaveMessage("");
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
      setSaveMessage("You can add a maximum of 3 pricing packages.");
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
  };

  const removePackage = (packageIndex) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      packages: currentProfile.packages.filter(
        (_, index) => index !== packageIndex,
      ),
    }));
    setSaveMessage("");
  };

  const resetProfile = () => {
    setProfile(initialProfile);
    setAmenityInput("");
    setSaveMessage("Demo profile values restored.");
    clearVendorProfile(user);
  };

  const handleSave = (event) => {
    event.preventDefault();

    try {
      saveVendorProfile(user, profile);
      setSaveMessage(
        "Business profile saved in this browser. Backend sync can replace this later.",
      );
    } catch {
      setSaveMessage(
        "Profile text is ready, but large image previews could not be stored in this browser.",
      );
    }
  };

  const clientSatisfaction = calculateClientSatisfaction(
    systemAverageReviewRating,
  );

  const formattedStartingPrice = profile.startingPrice
    ? `৳${Number(profile.startingPrice).toLocaleString("en-BD")}`
    : "Price not added";

  return (
    <form className="vbp-profile" onSubmit={handleSave}>
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
                  value={profile.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                >
                  {VENDOR_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
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

              <label className="vbp-field">
                <span>Client satisfaction (%)</span>
                <input
                  type="text"
                  value={`${clientSatisfaction}%`}
                  readOnly
                  aria-readonly="true"
                  title="Calculated automatically from the average review rating"
                />
                <small>
                  Automatically calculated from the average review rating (
                  {systemAverageReviewRating.toFixed(1)} × 20).
                </small>
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
                  {profile.category || "Vendor category"} ·{` `}
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
              Image previews are frontend-only until media storage is connected.
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
            <div className="vbp-portfolio-item" key={`${image}-${imageIndex}`}>
              <img src={image} alt={`Portfolio preview ${imageIndex + 1}`} />

              <button
                type="button"
                aria-label={`Remove portfolio image ${imageIndex + 1}`}
                onClick={() => removePortfolioImage(imageIndex)}
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
            Current frontend data is stored locally until backend integration.
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
            Reset changes
          </button>

          <button type="submit" className="vbp-save-button">
            <Save size={18} />
            Save changes
          </button>
        </div>
      </section>
    </form>
  );
}

export default BusinessProfile;
