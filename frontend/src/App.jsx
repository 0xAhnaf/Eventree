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
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";

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
      user.role === "client"
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

function App() {
  return (
    <AuthProvider>
      <main>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<GlobalLandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/browse-vendor/:id" element={<VendorDetailsPage />} />

            {/* Client-Only Route */}
            <Route
              path="/browse-vendor"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <ClientLandingPage />
                </ProtectedRoute>
              }
            />

            {/* Vendor-Only Route (or allow admin to inspect if desired) */}
            <Route
              path="/vendor"
              element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <VendorLandingPage />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </main>
    </AuthProvider>
  );
}

export default App;