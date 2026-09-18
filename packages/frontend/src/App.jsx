import { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import ClientLandingPage from "./pages/ClientLandingPage/ClientLandingPage.jsx";
import VendorLandingPage from "./pages/VendorLandingPage/VendorLandingPage.jsx";
import ForgotPassword from "./pages/ForgotPassPage/ForgotPassPage.jsx";
import ResetPassword from "./pages/ResetPassWord/ResetPassword.jsx";
import VendorDetailsPage from "./pages/VendorDetailsPage/VendorDetailsPage.jsx";
import BookingRequestSuccessPage from "./pages/BookingRequestSuccessPage/BookingRequestSuccessPage.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import VendorOnboarding from "./pages/VendorOnboarding/VendorOnboarding.jsx";
import VendorPaymentPage from "./pages/VendorPaymentPage/VendorPaymentPage.jsx";
import { isVendorOnboardingRequired } from "./utils/vendorProfileStorage.js";
import {
  isVendorPaymentCompleted,
  isVendorPaymentRequired,
} from "./utils/vendorPaymentStorage.js";
import { completeVendorRegistrationPayment } from "./services/vendorApi.js";

import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import MyEvents from "./pages/MyEvents/MyEvents.jsx";
import EmailVerified from "./pages/EmailVerified/EmailVerified.jsx";

// Role-Based Access Control (RBAC) Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // 1. If not logged in, force to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If user's role isn't allowed, redirect them to their home route or landing page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Smart redirect based on their role
    const fallbackRoute =
      user.role === "customer"
        ? "/browse-vendor"
        : user.role === "vendor"
          ? "/vendor"
          : user.role === "admin"
            ? "/admin"
            : "/";

    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

const HomeRoute = () => {
  const { user } = useAuth();

  if (isVendorOnboardingRequired(user)) {
    return <Navigate to="/vendor/onboarding" replace />;
  }

  if (isVendorPaymentRequired(user)) {
    return <Navigate to="/vendor/payment" replace />;
  }

  return <GlobalLandingPage />;
};

const VendorOnboardingGuard = ({ children }) => {
  const { user } = useAuth();

  if (isVendorOnboardingRequired(user)) {
    return <Navigate to="/vendor/onboarding" replace />;
  }

  if (isVendorPaymentRequired(user)) {
    return <Navigate to="/vendor/payment" replace />;
  }

  return children;
};

const VendorOnboardingRoute = () => {
  const { user } = useAuth();

  if (!isVendorOnboardingRequired(user)) {
    const nextRoute = isVendorPaymentRequired(user)
      ? "/vendor/payment"
      : "/vendor";

    return <Navigate to={nextRoute} replace />;
  }

  return <VendorOnboarding />;
};

const VendorPaymentRoute = () => {
  const { user } = useAuth();

  if (isVendorOnboardingRequired(user)) {
    return <Navigate to="/vendor/onboarding" replace />;
  }

  if (isVendorPaymentCompleted(user)) {
    return <Navigate to="/vendor" replace />;
  }

  return <VendorPaymentPage />;
};

const VendorRegistrationStatusSync = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== "vendor" || !isVendorPaymentCompleted(user)) return;

    // Migrates vendors who completed the earlier localStorage-only mock
    // payment flow to the backend registration status on their next visit.
    completeVendorRegistrationPayment().catch(() => {
      // The normal payment page still reports backend failures interactively.
    });
  }, [user]);

  return children;
};

function App() {
  return (
    <AuthProvider>
      <VendorRegistrationStatusSync>
        <main>
          <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<EmailVerified />} />
            <Route
              path="/browse-vendor/:id/booking-request-sent"
              element={<BookingRequestSuccessPage />}
            />
            <Route path="/browse-vendor/:id" element={<VendorDetailsPage />} />
            <Route path="/browse-vendor" element={<ClientLandingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-events" element={<MyEvents />} />
            {/* Vendor-Only Route (or allow admin to inspect if desired) */}
            <Route
              path="/vendor/onboarding"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <VendorOnboardingRoute />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendor"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <VendorOnboardingGuard>
                    <VendorLandingPage />
                  </VendorOnboardingGuard>
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendor/payment"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <VendorPaymentRoute />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          </BrowserRouter>
        </main>
      </VendorRegistrationStatusSync>
    </AuthProvider>
  );
}

export default App;
