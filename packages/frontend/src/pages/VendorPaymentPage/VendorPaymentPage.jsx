import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { completeVendorRegistrationPayment } from "../../services/vendorApi.js";
import { markVendorPaymentCompleted } from "../../utils/vendorPaymentStorage.js";
import PaymentAction from "./components/PaymentAction.jsx";
import PaymentHero from "./components/PaymentHero.jsx";
import PaymentMethodSelector from "./components/PaymentMethodSelector.jsx";
import PaymentProgress from "./components/PaymentProgress.jsx";
import PaymentSecurityNotice from "./components/PaymentSecurityNotice.jsx";
import PaymentSummary from "./components/PaymentSummary.jsx";
import RegistrationBenefits from "./components/RegistrationBenefits.jsx";
import VendorSummary from "./components/VendorSummary.jsx";
import "./VendorPaymentPage.css";

const VENDOR_REGISTRATION_FEE = 500;

function VendorPaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState("bkash");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const formattedFee = `৳${VENDOR_REGISTRATION_FEE.toLocaleString("en-BD")}`;

  const handleContinueToDashboard = async () => {
    if (!hasAcceptedTerms || isProcessing) return;

    setIsProcessing(true);
    setPaymentError("");

    try {
      await completeVendorRegistrationPayment();
      markVendorPaymentCompleted(user);

      // This is still a mock payment. The backend now persists completion so
      // public vendor visibility does not depend on this browser's storage.
      navigate("/vendor", { replace: true });
    } catch (error) {
      setPaymentError(
        error.message || "Payment completion could not be saved. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="vpp-page">
      <Navbar />

      <main className="vpp-main">
        <div className="vpp-container">
          <PaymentProgress />
          <PaymentHero formattedFee={formattedFee} />
          <VendorSummary user={user} />

          <div className="vpp-layout">
            <RegistrationBenefits />

            <section className="vpp-checkout" aria-label="Registration payment">
              <div className="vpp-gateway-shell">
                <PaymentMethodSelector
                  selectedMethod={selectedMethod}
                  onSelect={setSelectedMethod}
                />

                <div className="vpp-gateway-main">
                  <PaymentSummary
                    selectedMethod={selectedMethod}
                    formattedFee={formattedFee}
                  />

                  <PaymentAction
                    formattedFee={formattedFee}
                    isProcessing={isProcessing}
                    hasAcceptedTerms={hasAcceptedTerms}
                    onTermsChange={setHasAcceptedTerms}
                    onContinue={handleContinueToDashboard}
                    errorMessage={paymentError}
                  />
                </div>
              </div>

              <PaymentSecurityNotice />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default VendorPaymentPage;
