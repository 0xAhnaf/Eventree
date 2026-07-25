import { Routes, Route, BrowserRouter } from "react-router-dom";

import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import ClientLandingPage from "./pages/ClientLandingPage/ClientLandingPage.jsx";
import VendorLandingPage from "./pages/VendorLandingPage/VendorLandingPage.jsx";
import ForgotPassword from "./pages/ForgotPassPage/ForgotPassPage.jsx";
import ResetPassword from "./pages/ResetPassWord/ResetPassword.jsx";

import VendorDetailsPage from "./pages/VendorDetailsPage/VendorDetailsPage.jsx";

// Admin Dashboard
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";


function App() {
  return (
    <main>

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<GlobalLandingPage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/browse-vendor" element={<ClientLandingPage />} />

          <Route path="/vendor" element={<VendorLandingPage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/vendor-details" element={<VendorDetailsPage />} />


          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />


        </Routes>

      </BrowserRouter>

    </main>
  );
}

export default App;