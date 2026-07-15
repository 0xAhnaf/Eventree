import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import ClientLandingPage from "./pages/ClientLandingPage/ClientLandingPage.jsx";
import VendorLandingPage from "./pages/VendorLandingPage/VendorLandingPage.jsx";

// A quick helper style object for the demo navigation bar
const navStyle = {
  display: "flex",
  gap: "20px",
  justifyContent: "center",
  padding: "15px",
  background: "#1e293b",
  marginBottom: "20px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

function App() {
  return (
    <main>
      <BrowserRouter>
        {/* Quick navigation header so you can test the routes */}
        <nav style={navStyle}>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
          <Link to="/signup" style={linkStyle}>
            Sign Up
          </Link>
          {/* Temporary links for testing role-specific portals */}
          <Link to="/client" style={linkStyle}>
            Client Home (Mock)
          </Link>
          <Link to="/vendor" style={linkStyle}>
            Vendor Home (Mock)
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<GlobalLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/client" element={<ClientLandingPage />} />
          <Route path="/vendor" element={<VendorLandingPage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
