import { Routes, Route, BrowserRouter } from "react-router-dom";

import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import ClientLandingPage from "./pages/ClientLandingPage/ClientLandingPage.jsx";
import VendorLandingPage from "./pages/VendorLandingPage/VendorLandingPage.jsx";
import ForgotPassword from "./pages/ForgotPassPage/ForgotPassPage.jsx";
import ResetPassword from "./pages/ResetPassWord/ResetPassword.jsx";
// A quick helper style object for the demo navigation bar

import VendorDetailsPage from "./pages/VendorDetailsPage/VendorDetailsPage.jsx";


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

          <Route path="/browse-vendor/:id" element={<VendorDetailsPage />} />

        </Routes>

      </BrowserRouter>
    </main>
  );
}

export default App;