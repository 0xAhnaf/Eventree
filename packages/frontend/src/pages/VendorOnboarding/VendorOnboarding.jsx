import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Globe2,
  ImagePlus,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";

import eventreeLogo from "../../assets/eventree-logo2.png";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  completeVendorOnboarding,
  createEmptyVendorProfile,
  isVendorOnboardingRequired,
  loadVendorOnboardingDraft,
  loadVendorProfile,
  saveVendorOnboardingDraft,
  VENDOR_CATEGORIES,
} from "../../utils/vendorProfileStorage.js";
import "./VendorOnboarding.css";

const onboardingSteps = [
  {
    title: "Business information",
    description: "Tell clients what your business offers.",
  },
  {
    title: "Location and contact",
    description: "Add the details clients will use to reach you.",
  },
  {
    title: "Profile highlights",
    description: "Add optional public details and images.",
  },
  {
    title: "Services and packages",
    description: "Optional details can also be added later.",
  },
  {
    title: "Review and finish",
    description: "Confirm the required details and continue.",
  },
];

const lastStepIndex = onboardingSteps.length - 1;

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value.trim());

const isValidWebsite = (value) => {
  try {
    const websiteUrl = new URL(value.trim());
    return ["http:", "https:"].includes(websiteUrl.protocol);
  } catch {
    return false;
  }
};

const getStepErrors = (stepIndex, profile) => {
  const stepErrors = {};

  if (stepIndex === 0) {
    if (!profile.businessName.trim()) {
      stepErrors.businessName = "Business name is required.";
    }

    if (!profile.category.trim()) {
      stepErrors.category = "Vendor category is required.";
    }

    if (!profile.description.trim()) {
      stepErrors.description = "Business description is required.";
    }
  }

  if (stepIndex === 1) {
    if (!profile.location.trim()) {
      stepErrors.location = "City or area is required.";
    }

    if (!profile.fullAddress.trim()) {
      stepErrors.fullAddress = "Full address is required.";
    }

    if (!profile.email.trim()) {
      stepErrors.email = "Business email is required.";
    } else if (!isValidEmail(profile.email)) {
      stepErrors.email = "Enter a valid email address.";
    }

    if (!profile.phone.trim()) {
      stepErrors.phone = "Phone number is required.";
    }

    if (!profile.website.trim()) {
      stepErrors.website = "Website is required.";
    } else if (!isValidWebsite(profile.website)) {
      stepErrors.website = "Use a full URL, for example https://example.com.";
    }

    if (!profile.managerName.trim()) {
      stepErrors.managerName = "Manager or contact person is required.";
    }
  }

  return stepErrors;
};

const formatPrice = (price) => {
  if (!String(price || "").trim()) {
    return "Not added";
  }

  return `৳${Number(price).toLocaleString("en-BD")}`;
};

function VendorOnboarding() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initialOnboardingState = useMemo(() => {
    const savedDraft = loadVendorOnboardingDraft(user);

    if (savedDraft) {
      return {
        currentStep: Math.min(savedDraft.currentStep, lastStepIndex),
        profile: savedDraft.profile,
      };
    }

    return {
      currentStep: 0,
      profile: loadVendorProfile(user, createEmptyVendorProfile(user)),
    };
  }, [user]);

  const [currentStep, setCurrentStep] = useState(
    initialOnboardingState.currentStep,
  );
  const [profile, setProfile] = useState(initialOnboardingState.profile);
  const [errors, setErrors] = useState({});
  const [amenityInput, setAmenityInput] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [imageMessage, setImageMessage] = useState("");

  useEffect(() => {
    const draftTimer = window.setTimeout(() => {
      try {
        saveVendorOnboardingDraft(user, profile, currentStep);
      } catch {
        setPageMessage(
          "Your changes are visible, but this browser could not save the latest draft.",
        );
      }
    }, 250);

    return () => window.clearTimeout(draftTimer);
  }, [currentStep, profile, user]);

  if (!user || user.role !== "vendor") {
    return <Navigate to="/login" replace />;
  }

  if (!isVendorOnboardingRequired(user)) {
    return <Navigate to="/vendor" replace />;
  }

  const currentStepDetails = onboardingSteps[currentStep];
  const progressPercentage = Math.round(
    ((currentStep + 1) / onboardingSteps.length) * 100,
  );

  const updateField = (field, value) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
    setPageMessage("");
  };

  const renderFieldError = (fieldName) =>
    errors[fieldName] ? (
      <span className="vob-field-error">{errors[fieldName]}</span>
    ) : null;

  const validateAndContinue = () => {
    const stepErrors = getStepErrors(currentStep, profile);

    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      setPageMessage("Complete the highlighted required fields to continue.");
      return;
    }

    setErrors({});
    setPageMessage("");
    setCurrentStep((step) => Math.min(step + 1, lastStepIndex));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setPageMessage("");
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishOnboarding = () => {
    const businessErrors = getStepErrors(0, profile);
    const contactErrors = getStepErrors(1, profile);

    if (Object.keys(businessErrors).length) {
      setErrors(businessErrors);
      setCurrentStep(0);
      setPageMessage("Complete the required business information first.");
      return;
    }

    if (Object.keys(contactErrors).length) {
      setErrors(contactErrors);
      setCurrentStep(1);
      setPageMessage(
        "Complete the required location and contact details first.",
      );
      return;
    }

    try {
      completeVendorOnboarding(user, profile);
      navigate("/vendor", { replace: true });
    } catch {
      setPageMessage(
        "The profile could not be saved in this browser. Please try again.",
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (currentStep === lastStepIndex) {
      finishOnboarding();
      return;
    }

    validateAndContinue();
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleCoverUpload = async (event) => {
    const [selectedFile] = Array.from(event.target.files || []);

    if (!selectedFile) {
      return;
    }

    try {
      const imagePreview = await readImageFile(selectedFile);
      updateField("coverImage", imagePreview);
      setImageMessage("");
    } catch {
      setImageMessage("The selected cover image could not be loaded.");
    }

    event.target.value = "";
  };

  const handlePortfolioUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    try {
      const newImages = await Promise.all(selectedFiles.map(readImageFile));

      setProfile((currentProfile) => ({
        ...currentProfile,
        portfolio: [...currentProfile.portfolio, ...newImages],
      }));
      setImageMessage("");
    } catch {
      setImageMessage("One or more portfolio images could not be loaded.");
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
  };

  const addAmenity = () => {
    const newAmenity = amenityInput.trim();

    if (!newAmenity) {
      return;
    }

    const alreadyAdded = profile.amenities.some(
      (amenity) => amenity.toLowerCase() === newAmenity.toLowerCase(),
    );

    if (alreadyAdded) {
      setAmenityInput("");
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      amenities: [...currentProfile.amenities, newAmenity],
    }));
    setAmenityInput("");
  };

  const removeAmenity = (amenityToRemove) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      amenities: currentProfile.amenities.filter(
        (amenity) => amenity !== amenityToRemove,
      ),
    }));
  };

  const addPackage = () => {
    if (profile.packages.length >= 3) {
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      packages: [
        ...currentProfile.packages,
        {
          id: `package-${Date.now()}`,
          name: "",
          price: "",
          features: [],
        },
      ],
    }));
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
  };

  const updatePackageFeatures = (packageIndex, value) => {
    updatePackage(
      packageIndex,
      "features",
      value
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
    );
  };

  const removePackage = (packageIndex) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      packages: currentProfile.packages.filter(
        (_, index) => index !== packageIndex,
      ),
    }));
  };

  const renderBusinessStep = () => (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon">
          <Building2 size={23} />
        </span>
        <div>
          <h2>Tell us about your business</h2>
          <p>
            These required details will appear in your vendor banner, header,
            and About section.
          </p>
        </div>
      </div>

      <div className="vob-field-grid">
        <label className="vob-field">
          <span>
            Business name <b>*</b>
          </span>
          <input
            className={errors.businessName ? "vob-input-invalid" : ""}
            type="text"
            value={profile.businessName}
            onChange={(event) =>
              updateField("businessName", event.target.value)
            }
            placeholder="Enter your business name"
            autoComplete="organization"
          />
          {renderFieldError("businessName")}
        </label>

        <label className="vob-field">
          <span>
            Vendor category <b>*</b>
          </span>
          <select
            className={errors.category ? "vob-input-invalid" : ""}
            value={profile.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            <option value="">Select a vendor category</option>
            {VENDOR_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {renderFieldError("category")}
        </label>

        <label className="vob-field vob-field-full">
          <span>
            Business description <b>*</b>
          </span>
          <textarea
            className={errors.description ? "vob-input-invalid" : ""}
            rows="6"
            maxLength="600"
            value={profile.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe your services, style, and experience"
          />
          <div className="vob-field-meta">
            {renderFieldError("description")}
            <small>{profile.description.length}/600 characters</small>
          </div>
        </label>
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon">
          <MapPin size={23} />
        </span>
        <div>
          <h2>Add your location and contact details</h2>
          <p>
            All fields in this step are required. You can edit them later from
            Business Profile.
          </p>
        </div>
      </div>

      <div className="vob-field-grid">
        <label className="vob-field">
          <span>
            City / area <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.location ? "vob-input-invalid" : ""}`}
          >
            <MapPin size={17} />
            <input
              type="text"
              value={profile.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="Example: Dhaka, BD"
              autoComplete="address-level2"
            />
          </div>
          {renderFieldError("location")}
        </label>

        <label className="vob-field">
          <span>
            Full address <b>*</b>
          </span>
          <input
            className={errors.fullAddress ? "vob-input-invalid" : ""}
            type="text"
            value={profile.fullAddress}
            onChange={(event) => updateField("fullAddress", event.target.value)}
            placeholder="Enter your business address"
            autoComplete="street-address"
          />
          {renderFieldError("fullAddress")}
        </label>

        <label className="vob-field">
          <span>
            Business email <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.email ? "vob-input-invalid" : ""}`}
          >
            <Mail size={17} />
            <input
              type="email"
              value={profile.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="business@example.com"
              autoComplete="email"
            />
          </div>
          {renderFieldError("email")}
        </label>

        <label className="vob-field">
          <span>
            Phone number <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.phone ? "vob-input-invalid" : ""}`}
          >
            <Phone size={17} />
            <input
              type="tel"
              value={profile.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+880 1XXXXXXXXX"
              autoComplete="tel"
            />
          </div>
          {renderFieldError("phone")}
        </label>

        <label className="vob-field">
          <span>
            Website <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.website ? "vob-input-invalid" : ""}`}
          >
            <Globe2 size={17} />
            <input
              type="url"
              value={profile.website}
              onChange={(event) => updateField("website", event.target.value)}
              placeholder="https://yourwebsite.com"
              autoComplete="url"
            />
          </div>
          {renderFieldError("website")}
        </label>

        <label className="vob-field">
          <span>
            Manager / contact person <b>*</b>
          </span>
          <div
            className={`vob-input-with-icon ${errors.managerName ? "vob-input-invalid" : ""}`}
          >
            <UserRound size={17} />
            <input
              type="text"
              value={profile.managerName}
              onChange={(event) =>
                updateField("managerName", event.target.value)
              }
              placeholder="Enter contact person name"
              autoComplete="name"
            />
          </div>
          {renderFieldError("managerName")}
        </label>
      </div>
    </div>
  );

  const renderHighlightsStep = () => (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon">
          <Sparkles size={23} />
        </span>
        <div>
          <div className="vob-heading-with-badge">
            <h2>Make your public profile stand out</h2>
            <span>Optional</span>
          </div>
          <p>
            Add these now, skip them, or update them later from Business
            Profile.
          </p>
        </div>
      </div>

      <div className="vob-field-grid vob-three-column-grid">
        <label className="vob-field">
          <span>Years of experience</span>
          <input
            type="number"
            min="0"
            value={profile.yearsExperience}
            onChange={(event) =>
              updateField("yearsExperience", event.target.value)
            }
            placeholder="Example: 5"
          />
        </label>

        <label className="vob-field">
          <span>Events completed</span>
          <input
            type="number"
            min="0"
            value={profile.eventsCompleted}
            onChange={(event) =>
              updateField("eventsCompleted", event.target.value)
            }
            placeholder="Example: 120"
          />
        </label>

        <label className="vob-field">
          <span>Starting price</span>
          <div className="vob-input-with-icon">
            <Banknote size={17} />
            <input
              type="number"
              min="0"
              value={profile.startingPrice}
              onChange={(event) =>
                updateField("startingPrice", event.target.value)
              }
              placeholder="Amount in Taka"
            />
          </div>
        </label>
      </div>

      <div className="vob-media-grid">
        <section className="vob-sub-card">
          <div className="vob-sub-card-heading">
            <span className="vob-small-icon">
              <Camera size={19} />
            </span>
            <div>
              <h3>Cover image</h3>
              <p>Optional · Recommended ratio 16:6</p>
            </div>
          </div>

          {profile.coverImage ? (
            <div className="vob-cover-preview">
              <img src={profile.coverImage} alt="Business cover preview" />
              <button
                type="button"
                onClick={() => updateField("coverImage", "")}
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          ) : (
            <label className="vob-cover-upload">
              <Upload size={23} />
              <strong>Add cover image</strong>
              <span>JPG, PNG or WEBP</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
              />
            </label>
          )}
        </section>

        <section className="vob-sub-card">
          <div className="vob-sub-card-heading">
            <span className="vob-small-icon">
              <ImagePlus size={19} />
            </span>
            <div>
              <h3>Portfolio gallery</h3>
              <p>Optional · Add photos of your work</p>
            </div>
          </div>

          <div className="vob-portfolio-grid">
            {profile.portfolio.map((image, imageIndex) => (
              <div
                className="vob-portfolio-item"
                key={`${imageIndex}-${image.slice(-20)}`}
              >
                <img src={image} alt={`Portfolio ${imageIndex + 1}`} />
                <button
                  type="button"
                  aria-label={`Remove portfolio image ${imageIndex + 1}`}
                  onClick={() => removePortfolioImage(imageIndex)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <label className="vob-portfolio-upload">
              <ImagePlus size={21} />
              <span>Add photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePortfolioUpload}
              />
            </label>
          </div>
        </section>
      </div>

      {imageMessage && <p className="vob-inline-message">{imageMessage}</p>}

      <p className="vob-storage-note">
        Images are optional. You can skip them now and add or replace them later
        from Business Profile.
      </p>
    </div>
  );

  const renderServicesStep = () => (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon">
          <Check size={23} />
        </span>
        <div>
          <div className="vob-heading-with-badge">
            <h2>Add services and pricing packages</h2>
            <span>Optional</span>
          </div>
          <p>
            Both sections can be skipped now and completed later from Business
            Profile.
          </p>
        </div>
      </div>

      <section className="vob-sub-card vob-service-card">
        <div className="vob-sub-card-heading">
          <span className="vob-small-icon">
            <Check size={19} />
          </span>
          <div>
            <h3>Key amenities and services</h3>
            <p>Add one service at a time.</p>
          </div>
        </div>

        <div className="vob-add-row">
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

        {profile.amenities.length ? (
          <div className="vob-chip-list">
            {profile.amenities.map((amenity) => (
              <span className="vob-chip" key={amenity}>
                <Check size={14} />
                {amenity}
                <button
                  type="button"
                  aria-label={`Remove ${amenity}`}
                  onClick={() => removeAmenity(amenity)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="vob-empty-message">No amenities added yet.</p>
        )}
      </section>

      <section className="vob-sub-card vob-package-section">
        <div className="vob-package-section-heading">
          <div className="vob-sub-card-heading">
            <span className="vob-small-icon">
              <Banknote size={19} />
            </span>
            <div>
              <h3>Pricing packages</h3>
              <p>Add up to three packages.</p>
            </div>
          </div>

          {profile.packages.length < 3 && (
            <button
              type="button"
              className="vob-add-package-button"
              onClick={addPackage}
            >
              <Plus size={17} />
              Add package ({profile.packages.length}/3)
            </button>
          )}
        </div>

        {profile.packages.length ? (
          <div className="vob-package-grid">
            {profile.packages.map((packageItem, packageIndex) => (
              <article className="vob-package-card" key={packageItem.id}>
                <div className="vob-package-header">
                  <span>Package {packageIndex + 1}</span>
                  <button
                    type="button"
                    aria-label={`Remove package ${packageIndex + 1}`}
                    onClick={() => removePackage(packageIndex)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <label className="vob-field">
                  <span>Package name</span>
                  <input
                    type="text"
                    value={packageItem.name}
                    onChange={(event) =>
                      updatePackage(packageIndex, "name", event.target.value)
                    }
                    placeholder="Example: General Package"
                  />
                </label>

                <label className="vob-field">
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

                <label className="vob-field">
                  <span>Package features</span>
                  <textarea
                    rows="5"
                    value={packageItem.features.join("\n")}
                    onChange={(event) =>
                      updatePackageFeatures(packageIndex, event.target.value)
                    }
                    placeholder="Write one feature per line"
                  />
                </label>
              </article>
            ))}
          </div>
        ) : (
          <div className="vob-empty-package">
            <Banknote size={26} />
            <p>No pricing packages added.</p>
            <span>You can add them now or later from Business Profile.</span>
          </div>
        )}
      </section>
    </div>
  );

  const renderReviewStep = () => (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon vob-success-icon">
          <CheckCircle2 size={24} />
        </span>
        <div>
          <h2>Your required information is ready</h2>
          <p>
            Review the summary below. Optional items can still be added from
            Business Profile after setup.
          </p>
        </div>
      </div>

      <div className="vob-review-grid">
        <section className="vob-review-card vob-review-card-wide">
          <div className="vob-review-heading">
            <Building2 size={19} />
            <h3>Business information</h3>
          </div>
          <dl>
            <div>
              <dt>Business name</dt>
              <dd>{profile.businessName}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{profile.category}</dd>
            </div>
            <div className="vob-review-full-row">
              <dt>Description</dt>
              <dd>{profile.description}</dd>
            </div>
          </dl>
          <button type="button" onClick={() => setCurrentStep(0)}>
            Edit business information
          </button>
        </section>

        <section className="vob-review-card vob-review-card-wide">
          <div className="vob-review-heading">
            <MapPin size={19} />
            <h3>Location and contact</h3>
          </div>
          <dl>
            <div>
              <dt>City / area</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Full address</dt>
              <dd>{profile.fullAddress}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{profile.phone}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>{profile.website}</dd>
            </div>
            <div>
              <dt>Contact person</dt>
              <dd>{profile.managerName}</dd>
            </div>
          </dl>
          <button type="button" onClick={() => setCurrentStep(1)}>
            Edit contact details
          </button>
        </section>

        <section className="vob-review-card">
          <div className="vob-review-heading">
            <Sparkles size={19} />
            <h3>Optional highlights</h3>
          </div>
          <ul>
            <li>
              <span>Experience</span>
              <strong>
                {profile.yearsExperience
                  ? `${profile.yearsExperience} years`
                  : "Not added"}
              </strong>
            </li>
            <li>
              <span>Events completed</span>
              <strong>{profile.eventsCompleted || "Not added"}</strong>
            </li>
            <li>
              <span>Starting price</span>
              <strong>{formatPrice(profile.startingPrice)}</strong>
            </li>
            <li>
              <span>Cover image</span>
              <strong>{profile.coverImage ? "Added" : "Not added"}</strong>
            </li>
            <li>
              <span>Portfolio photos</span>
              <strong>{profile.portfolio.length}</strong>
            </li>
          </ul>
          <button type="button" onClick={() => setCurrentStep(2)}>
            Edit profile highlights
          </button>
        </section>

        <section className="vob-review-card">
          <div className="vob-review-heading">
            <Banknote size={19} />
            <h3>Optional services</h3>
          </div>
          <ul>
            <li>
              <span>Amenities</span>
              <strong>{profile.amenities.length}</strong>
            </li>
            <li>
              <span>Pricing packages</span>
              <strong>{profile.packages.length}</strong>
            </li>
          </ul>
          <button type="button" onClick={() => setCurrentStep(3)}>
            Edit services and packages
          </button>
        </section>
      </div>

      <div className="vob-ready-banner">
        <CheckCircle2 size={22} />
        <div>
          <strong>Ready to continue to your vendor dashboard</strong>
          <p>
            Your onboarding data will also appear in Dashboard → Business
            Profile.
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBusinessStep();
      case 1:
        return renderContactStep();
      case 2:
        return renderHighlightsStep();
      case 3:
        return renderServicesStep();
      default:
        return renderReviewStep();
    }
  };

  return (
    <div className="vob-page">
      <header className="vob-header">
        <div className="vob-brand">
          <img src={eventreeLogo} alt="Eventree" />
          <span>Eventree</span>
        </div>

        <div className="vob-account">
          <div>
            <span>Signed in as</span>
            <strong>{user.email}</strong>
          </div>
          <button type="button" onClick={handleSignOut}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </header>

      <div className="vob-layout">
        <aside className="vob-sidebar">
          <span className="vob-eyebrow">VENDOR SETUP</span>
          <h1>Let’s set up your business profile</h1>
          <p>
            Complete the required details once. You can manage everything later
            from your vendor dashboard.
          </p>

          <div className="vob-progress-summary">
            <div>
              <span>
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <strong>{progressPercentage}%</strong>
            </div>
            <div
              className="vob-progress-track"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={progressPercentage}
            >
              <span style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <ol className="vob-step-list">
            {onboardingSteps.map((step, stepIndex) => {
              const isComplete = stepIndex < currentStep;
              const isActive = stepIndex === currentStep;

              return (
                <li
                  className={`${isActive ? "vob-step-active" : ""} ${isComplete ? "vob-step-complete" : ""}`}
                  key={step.title}
                >
                  <span className="vob-step-number">
                    {isComplete ? <Check size={16} /> : stepIndex + 1}
                  </span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                  {isActive && <ChevronRight size={18} />}
                </li>
              );
            })}
          </ol>
        </aside>

        <main className="vob-main">
          <form className="vob-form-card" onSubmit={handleSubmit} noValidate>
            <div className="vob-mobile-progress">
              <span>
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <strong>{currentStepDetails.title}</strong>
              <div className="vob-progress-track">
                <span style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            {pageMessage && (
              <div className="vob-page-message" role="alert">
                {pageMessage}
              </div>
            )}

            {renderCurrentStep()}

            <div className="vob-form-footer">
              <div>
                {currentStep > 0 && (
                  <button
                    type="button"
                    className="vob-back-button"
                    onClick={goBack}
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                )}
              </div>

              <div className="vob-forward-actions">
                {currentStep >= 2 && currentStep < lastStepIndex && (
                  <button
                    type="button"
                    className="vob-skip-button"
                    onClick={validateAndContinue}
                  >
                    Skip for now
                  </button>
                )}

                <button type="submit" className="vob-continue-button">
                  {currentStep === lastStepIndex
                    ? "Finish setup"
                    : currentStep >= 2
                      ? "Save and continue"
                      : "Continue"}
                  {currentStep === lastStepIndex ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <ArrowRight size={18} />
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default VendorOnboarding;
