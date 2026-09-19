import { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";
import BookingSuccessCard from "./components/BookingSuccessCard.jsx";
import "./BookingRequestSuccessPage.css";

const REDIRECT_DELAY_MS = 3000;

function BookingRequestSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const confirmation = location.state;
  const hasValidConfirmation =
    confirmation?.bookingRequestSent === true &&
    String(confirmation.vendorId) === String(id);

  const returnToVendor = useCallback(() => {
    navigate(`/browse-vendor/${id}${confirmation?.eventId ? `?eventId=${encodeURIComponent(confirmation.eventId)}` : ""}`, { replace: true });
  }, [id, navigate, confirmation?.eventId]);

  useEffect(() => {
    if (!hasValidConfirmation) {
      navigate("/browse-vendor", { replace: true });
      return undefined;
    }

    const redirectTimer = window.setTimeout(
      returnToVendor,
      REDIRECT_DELAY_MS,
    );

    return () => window.clearTimeout(redirectTimer);
  }, [hasValidConfirmation, navigate, returnToVendor]);

  if (!hasValidConfirmation) return null;

  return (
    <div className="brs-page">
      <Navbar />

      <main className="brs-main">
        <BookingSuccessCard
          vendorName={confirmation.vendorName}
          eventDate={confirmation.eventDate}
          packageName={confirmation.packageName}
          onReturn={returnToVendor}
        />
      </main>

      <Footer />
    </div>
  );
}

export default BookingRequestSuccessPage;
