import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  fetchVendorRegistrationStatus,
  initiateVendorRegistrationPayment,
} from "../../services/vendorApi.js";
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

// Display fallback only. The real amount is decided by the backend
// (config/eventree.php) and returned by /vendor/registration-status.
const DEFAULT_REGISTRATION_FEE = 500;

function VendorPaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState("sslcommerz");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [registrationFee, setRegistrationFee] = useState(
    DEFAULT_REGISTRATION_FEE,
  );

  const formattedFee = `৳${Number(registrationFee).toLocaleString("en-BD")}`;

  useEffect(() => {
    fetchVendorRegistrationStatus()
      .then((status) => {
        if (status.registration_fee) {
          setRegistrationFee(status.registration_fee);
        }
      })
      .catch(() => {
        // Keep the fallback amount for display; the backend still decides.
      });
  }, []);

  // If the vendor presses the browser Back button on the gateway page, the
  // browser may restore this page from its back/forward cache with the button
  // still stuck on "Redirecting...". Reset it.
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) setIsProcessing(false);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleProceedToPayment = async () => {
    if (!hasAcceptedTerms || isProcessing) return;

    setIsProcessing(true);
    setPaymentError("");

    try {
      const result = await initiateVendorRegistrationPayment();

      if (result.already_paid) {
        markVendorPaymentCompleted(user);
        navigate("/vendor", { replace: true });
        return;
      }

      if (!result.gateway_url) {
        throw new Error("The payment page could not be opened. Please try again.");
      }

      // Full-page redirect to the SSLCommerz hosted checkout. The vendor comes
      // back via the backend callback -> /vendor/payment/result.
      window.location.assign(result.gateway_url);
    } catch (error) {
      setPaymentError(
        error.message || "Payment could not be started. Please try again.",
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
                    onContinue={handleProceedToPayment}
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
