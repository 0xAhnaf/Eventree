import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  completeVendorOnboarding,
  createEmptyVendorProfile,
  isVendorOnboardingRequired,
  loadVendorOnboardingDraft,
  loadVendorProfile,
  saveVendorOnboardingDraft,
} from "../../utils/vendorProfileStorage.js";

import OnboardingHeader from "./components/OnboardingHeader";
import OnboardingSidebar from "./components/OnboardingSidebar";
import OnboardingFooter from "./components/OnboardingFooter";
import BusinessStep from "./components/BusinessStep";
import ContactStep from "./components/ContactStep";
import HighlightsStep from "./components/HighlightsStep";
import ServicesStep from "./components/ServicesStep";
import ReviewStep from "./components/ReviewStep";

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

const backendFieldToFrontend = {
  business_name: "businessName",
  category_id: "category",
  description: "description",
  city: "location",
  full_address: "fullAddress",
  business_email: "email",
  phone: "phone",
  website: "website",
  manager_name: "managerName",
  years_of_experience: "yearsExperience",
  events_completed: "eventsCompleted",
  starting_price: "startingPrice",
};

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

const isValidEmail = (val) => /^\S+@\S+\.\S+$/.test(val.trim());
const isValidWebsite = (val) => {
  try {
    const url = new URL(val.trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const getStepErrors = (stepIndex, profile) => {
  const errors = {};
  if (stepIndex === 0) {
    if (!profile.businessName.trim())
      errors.businessName = "Business name is required.";
    if (!profile.categoryId)
      errors.category = "Vendor category is required.";
    if (!profile.description.trim())
      errors.description = "Business description is required.";
  }
  if (stepIndex === 1) {
    if (!profile.location.trim()) errors.location = "City or area is required.";
    if (!profile.fullAddress.trim())
      errors.fullAddress = "Full address is required.";
    if (!profile.email.trim()) errors.email = "Business email is required.";
    else if (!isValidEmail(profile.email))
      errors.email = "Enter a valid email address.";
    if (!profile.phone.trim()) errors.phone = "Phone number is required.";
    if (!profile.website.trim()) errors.website = "Website is required.";
    else if (!isValidWebsite(profile.website))
      errors.website = "Use a full URL, for example https://example.com.";
    if (!profile.managerName.trim())
      errors.managerName = "Manager or contact person is required.";
  }
  return errors;
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

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [portfolioImageFiles, setPortfolioImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch("http://127.0.0.1:8000/api/vendor-categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories.");
        return res.json();
      })
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch(() => {
        if (isMounted)
          setCategoriesError(
            "Could not load vendor categories. Please refresh.",
          );
      });
    return () => {
      isMounted = false;
    };
  }, []);

 useEffect(() => {
  const draftTimer = window.setTimeout(() => {
    try {
      const draftProfile = { ...profile, coverImage: "", portfolio: [] };
      saveVendorOnboardingDraft(user, draftProfile, currentStep);
    } catch {
      setPageMessage(
        "Your changes are visible, but this browser could not save the latest draft.",
      );
    }
  }, 250);
  return () => window.clearTimeout(draftTimer);
}, [currentStep, profile, user]);

  if (!user || user.role !== "vendor") return <Navigate to="/login" replace />;
  if (!isVendorOnboardingRequired(user))
    return <Navigate to="/vendor" replace />;

  const progressPercentage = Math.round(
    ((currentStep + 1) / onboardingSteps.length) * 100,
  );

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setPageMessage("");
  };

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

  const finishOnboarding = async () => {
    const bErrors = getStepErrors(0, profile);
    const cErrors = getStepErrors(1, profile);

    if (Object.keys(bErrors).length) {
      setErrors(bErrors);
      setCurrentStep(0);
      setPageMessage("Complete the required business information first.");
      return;
    }
    if (Object.keys(cErrors).length) {
      setErrors(cErrors);
      setCurrentStep(1);
      setPageMessage(
        "Complete the required location and contact details first.",
      );
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setPageMessage("");

    try {
      const token = localStorage.getItem("eventree_token");
      const formData = new FormData();

      formData.append("business_name", profile.businessName);
      formData.append("category_id", profile.categoryId);
      formData.append("description", profile.description);
      formData.append("city", profile.location);
      formData.append("full_address", profile.fullAddress);
      formData.append("business_email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("website", profile.website);
      formData.append("manager_name", profile.managerName);

      if (profile.yearsExperience !== "")
        formData.append("years_of_experience", profile.yearsExperience);
      if (profile.eventsCompleted !== "")
        formData.append("events_completed", profile.eventsCompleted);
      if (profile.startingPrice !== "")
        formData.append("starting_price", profile.startingPrice);

      if (coverImageFile) formData.append("cover_image", coverImageFile);
      portfolioImageFiles.forEach((file) => {
        formData.append("portfolio_images[]", file);
      });

      const response = await fetch("http://127.0.0.1:8000/api/vendor-profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 201) {
  const data = await response.json();
  const images = Array.isArray(data.vendor_profile?.images)
    ? data.vendor_profile.images
    : [];

  const coverImageUrl =
    images.find((img) => img.image_type === "cover")?.image_url || "";
  const portfolioUrls = images
    .filter((img) => img.image_type === "portfolio")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => img.image_url);

  const validAmenities = profile.amenities.filter((a) => a.trim());
  const validPackages = profile.packages
    .filter(
      (pkg) =>
        pkg.name.trim() &&
        pkg.price !== "" &&
        !Number.isNaN(Number(pkg.price)),
    )
    .map((pkg) => ({
      package_name: pkg.name.trim(),
      description: pkg.features.length ? pkg.features.join("\n") : null,
      price: Number(pkg.price),
    }));

  if (validAmenities.length || validPackages.length) {
    try {
      const detailsResponse = await fetch(
        "http://127.0.0.1:8000/api/vendor-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amenities: validAmenities,
            packages: validPackages,
          }),
        },
      );

      if (!detailsResponse.ok) {
        console.error(
          "Vendor amenities/packages could not be saved:",
          await detailsResponse.text(),
        );
      }
    } catch (detailsError) {
      console.error("Vendor details request failed:", detailsError);
    }
  }

  const savedProfile = {
    ...profile,
    coverImage: coverImageUrl,
    portfolio: portfolioUrls,
  };

  completeVendorOnboarding(user, savedProfile);
  navigate("/vendor", { replace: true });
  return;
}

      if (response.status === 422) {
        const data = await response.json();
        const backendErrors = data.errors || {};
        const mappedErrors = {};
        let firstErrorStep = null;

        Object.entries(backendErrors).forEach(([backendField, messages]) => {
          const baseField = backendField.replace(/\.\d+$/, "").replace("[]", "");

          if (baseField === "cover_image" || baseField === "portfolio_images") {
            setImageMessage(messages[0]);
            firstErrorStep = firstErrorStep ?? 2;
            return;
          }

          const frontendField = backendFieldToFrontend[baseField] || baseField;
          mappedErrors[frontendField] = messages[0];

          if (
            ["businessName", "category", "description"].includes(frontendField)
          ) {
            firstErrorStep = firstErrorStep ?? 0;
          } else {
            firstErrorStep = firstErrorStep ?? 1;
          }
        });

        setErrors(mappedErrors);
        setPageMessage(
          data.message || "Please fix the highlighted fields and try again.",
        );
        if (firstErrorStep !== null) setCurrentStep(firstErrorStep);
        return;
      }

      if (response.status === 401) {
        setPageMessage("Your session has expired. Please sign in again.");
        await logout();
        navigate("/login", { replace: true });
        return;
      }

      setPageMessage(
        "Something went wrong while saving your profile. Please try again.",
      );
    } catch {
      setPageMessage(
        "Could not connect to the server. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === lastStepIndex) {
      finishOnboarding();
    } else {
      validateAndContinue();
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleCoverUpload = async (e) => {
    const [file] = Array.from(e.target.files || []);
    if (!file) return;
    try {
      const preview = await readImageFile(file);
      updateField("coverImage", preview);
      setCoverImageFile(file);
      setImageMessage("");
    } catch {
      setImageMessage("The selected cover image could not be loaded.");
    }
    e.target.value = "";
  };

  const removeCoverImage = () => {
    updateField("coverImage", "");
    setCoverImageFile(null);
  };

  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const newImages = await Promise.all(files.map(readImageFile));
      setProfile((prev) => ({
        ...prev,
        portfolio: [...prev.portfolio, ...newImages],
      }));
      setPortfolioImageFiles((prev) => [...prev, ...files]);
      setImageMessage("");
    } catch {
      setImageMessage("One or more portfolio images could not be loaded.");
    }
    e.target.value = "";
  };

  const removePortfolioImage = (idx) => {
    setProfile((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== idx),
    }));
    setPortfolioImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const addAmenity = () => {
    const newAmenity = amenityInput.trim();
    if (!newAmenity) return;
    if (
      profile.amenities.some(
        (a) => a.toLowerCase() === newAmenity.toLowerCase(),
      )
    ) {
      setAmenityInput("");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      amenities: [...prev.amenities, newAmenity],
    }));
    setAmenityInput("");
  };

  const removeAmenity = (item) => {
    setProfile((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== item),
    }));
  };

  const addPackage = () => {
    if (profile.packages.length >= 3) return;
    setProfile((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        { id: `package-${Date.now()}`, name: "", price: "", features: [] },
      ],
    }));
  };

  const updatePackage = (idx, field, value) => {
    setProfile((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === idx ? { ...pkg, [field]: value } : pkg,
      ),
    }));
  };

  const updatePackageFeatures = (idx, value) => {
    updatePackage(
      idx,
      "features",
      value
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    );
  };

  const removePackage = (idx) => {
    setProfile((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== idx),
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BusinessStep
            profile={profile}
            errors={errors}
            updateField={updateField}
            categories={categories}
            categoriesError={categoriesError}
          />
        );
      case 1:
        return (
          <ContactStep
            profile={profile}
            errors={errors}
            updateField={updateField}
          />
        );
      case 2:
        return (
          <HighlightsStep
            profile={profile}
            updateField={updateField}
            handleCoverUpload={handleCoverUpload}
            removeCoverImage={removeCoverImage}
            handlePortfolioUpload={handlePortfolioUpload}
            removePortfolioImage={removePortfolioImage}
            imageMessage={imageMessage}
          />
        );
      case 3:
        return (
          <ServicesStep
            profile={profile}
            amenityInput={amenityInput}
            setAmenityInput={setAmenityInput}
            addAmenity={addAmenity}
            removeAmenity={removeAmenity}
            addPackage={addPackage}
            updatePackage={updatePackage}
            updatePackageFeatures={updatePackageFeatures}
            removePackage={removePackage}
          />
        );
      default:
        return <ReviewStep profile={profile} setCurrentStep={setCurrentStep} />;
    }
  };

  return (
    <div className="vob-page">
      <OnboardingHeader userEmail={user.email} onSignOut={handleSignOut} />

      <div className="vob-layout">
        <OnboardingSidebar
          steps={onboardingSteps}
          currentStep={currentStep}
          progressPercentage={progressPercentage}
        />

        <main className="vob-main">
          <form className="vob-form-card" onSubmit={handleSubmit} noValidate>
            <div className="vob-mobile-progress">
              <span>
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <strong>{onboardingSteps[currentStep].title}</strong>
              <div className="vob-progress-track">
                <span style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            {pageMessage && (
              <div className="vob-page-message" role="alert">
                {pageMessage}
              </div>
            )}

            {renderStep()}

            <OnboardingFooter
              currentStep={currentStep}
              lastStepIndex={lastStepIndex}
              goBack={goBack}
              validateAndContinue={validateAndContinue}
              isSubmitting={isSubmitting}
            />
          </form>
        </main>
      </div>
    </div>
  );
}

export default VendorOnboarding;