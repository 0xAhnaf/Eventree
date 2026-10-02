import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchVendorRegistrationStatus } from "../../services/vendorApi.js";
import { markVendorPaymentCompleted } from "../../utils/vendorPaymentStorage.js";
import "./VendorPaymentPage.css";
import "./VendorPaymentResult.css";

const COPY = {
  checking: {
    title: "Confirming your payment...",
    body: "Please wait while we verify the transaction with the payment gateway.",
  },
  paid: {
    title: "Payment successful",
    body: "Your registration is complete. Taking you to your dashboard...",
  },
  cancelled: {
    title: "Payment cancelled",
    body: "You cancelled the payment. You have not been charged.",
  },
  failed: {
    title: "Payment not completed",
    body: "We could not confirm your payment. If money was deducted, it will be reviewed automatically; otherwise you can try again.",
  },
  error: {
    title: "Could not confirm payment",
    body: "We could not reach the server to check your payment. Please refresh, or log in again.",
  },
};

function VendorPaymentResult() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState("checking");

  // ?status= is only a hint from the redirect and can be edited by anyone.
  // The real outcome always comes from the backend.
  const hint = searchParams.get("status");

  useEffect(() => {
    let timer;
    let cancelled = false;

    fetchVendorRegistrationStatus()
      .then((status) => {
        if (cancelled) return;

        if (status.payment_completed) {
          markVendorPaymentCompleted(user);
          setState("paid");
          timer = setTimeout(() => navigate("/vendor", { replace: true }), 1800);
        } else {
          setState(hint === "cancelled" ? "cancelled" : "failed");
        }
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { title, body } = COPY[state];

  return (
    <div className="vpp-page">
      <Navbar />

      <main className="vpp-main">
        <div className="vpp-container">
          <section className={`vpr-card vpr-${state}`} aria-live="polite">
            <h1>{title}</h1>
            <p>{body}</p>

            {(state === "cancelled" || state === "failed") && (
              <button
                type="button"
                className="vpp-pay-button"
                onClick={() => navigate("/vendor/payment", { replace: true })}
              >
                Try payment again
              </button>
            )}

            {state === "paid" && (
              <button
                type="button"
                className="vpp-pay-button"
                onClick={() => navigate("/vendor", { replace: true })}
              >
                Go to dashboard
              </button>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default VendorPaymentResult;
