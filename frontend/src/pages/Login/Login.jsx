import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, DEMO_USERS } from "../../context/AuthContext";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthCard from "../../components/Auth/AuthCard";
import AuthInput from "../../components/Auth/AuthInput";
import PasswordInput from "../../components/Auth/PasswordInput";
import Checkbox from "../../components/Auth/Checkbox";
import SubmitButton from "../../components/Auth/SubmitButton";
import SocialLogin from "../../components/Auth/SocialLogin";
import AuthFooter from "../../components/Auth/AuthFooter";
import ForgotPasswordLink from "../../components/Auth/ForgetPass";

import "./Login.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const result = login(identifier, password);

    if (result.success) {
      navigate(result.user.redirectTo, { replace: true });
    } else {
      setErrorMessage(result.message);
    }
  };

  // Helper to quick-fill form during presentation/demo
  const fillDemoUser = (demoUser) => {
    setIdentifier(demoUser.email);
    setPassword(demoUser.password);
    setErrorMessage("");
  };

  return (
    <AuthLayout
      title="Welcome Back."
      description="Sign in to continue managing your events with EVENTREE."
    >
      <AuthCard>
        <h2>Login</h2>
        <p>Welcome back! Please sign in.</p>

        {/* Demo Preset Quick-Fill Bar */}
        <div
          style={{
            margin: "1.25rem 0",
            padding: "0.875rem 1rem",
            background: "#f8fafc",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.625rem",
            }}
          >
            <span style={{ fontSize: "14px" }}>⚡</span>
            <small
              style={{
                fontWeight: "600",
                color: "#475569",
                fontSize: "12px",
                letterSpacing: "0.025em",
                textTransform: "uppercase",
              }}
            >
              Demo Quick Fill
            </small>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {DEMO_USERS.map((demoUser) => {
              // Accent colors per role for visual distinction
              const roleColors = {
                client: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
                vendor: { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
                admin: { bg: "#faf5ff", border: "#e9d5ff", text: "#6b21a8" },
              }[demoUser.role] || {
                bg: "#ffffff",
                border: "#cbd5e1",
                text: "#334155",
              };

              return (
                <button
                  key={demoUser.id}
                  type="button"
                  onClick={() => fillDemoUser(demoUser)}
                  style={{
                    flex: "1 1 0",
                    minWidth: "70px",
                    padding: "6px 10px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: `1px solid ${roleColors.border}`,
                    background: roleColors.bg,
                    color: roleColors.text,
                    transition: "all 0.15s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.05)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {demoUser.role.charAt(0).toUpperCase() +
                    demoUser.role.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {errorMessage && (
          <div
            style={{ color: "#d9534f", marginBottom: "1rem", fontSize: "14px" }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AuthInput
            id="identifier"
            type="text"
            label="Email or Phone Number"
            placeholder="email@example.com or 01700000001"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <ForgotPasswordLink />

          <Checkbox text="Remember me" />

          <SubmitButton text="Login" />
        </form>

        <SocialLogin />

        <AuthFooter
          text="Don't have an account?"
          linkText="Sign Up"
          link="/signup"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default Login;
