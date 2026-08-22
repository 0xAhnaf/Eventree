import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const result = await login(identifier.trim(), password);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setErrorMessage(result.message);
    }

    setLoading(false);
  };
  const DEMO_USERS = [
    {
      role: "customer",
      email: "client@eventree.com",
      phone: "01700000001",
      password: "password123",
    },
    {
      role: "vendor",
      email: "vendor@eventree.com",
      phone: "01700000002",
      password: "password123",
    },
    {
      role: "admin",
      email: "admin@eventree.com",
      phone: "01700000003",
      password: "password123",
    },
  ];

  return (
    <AuthLayout
      title="Welcome Back."
      description="Sign in to continue managing your events with EVENTREE."
    >
      <AuthCard>
        <h2>Login</h2>
        <p>Welcome back! Please sign in.</p>
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

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {DEMO_USERS.map((demoUser) => (
              <button
                key={demoUser.role}
                type="button"
                onClick={() => {
                  setIdentifier(demoUser.email);
                  setPassword(demoUser.password);
                  setErrorMessage("");
                }}
                style={{
                  flex: "1 1 0",
                  minWidth: "70px",
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#334155",
                }}
              >
                {demoUser.role.charAt(0).toUpperCase() + demoUser.role.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {errorMessage && (
          <div
            style={{
              color: "#d9534f",
              marginBottom: "1rem",
              fontSize: "14px",
            }}
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

          <SubmitButton text="Login" loading={loading} />
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
