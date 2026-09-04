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
    if (!profile.category.trim())
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

  const finishOnboarding = () => {
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

    try {
      completeVendorOnboarding(user, profile);
      navigate("/vendor", { replace: true });
    } catch {
      setPageMessage(
        "The profile could not be saved in this browser. Please try again.",
      );
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
      setImageMessage("");
    } catch {
      setImageMessage("The selected cover image could not be loaded.");
    }
    e.target.value = "";
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
            />
          </form>
        </main>
      </div>
    </div>
  );
}

export default VendorOnboarding;
