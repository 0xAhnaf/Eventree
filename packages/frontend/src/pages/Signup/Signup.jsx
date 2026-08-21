import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthCard from "../../components/Auth/AuthCard";
import AuthInput from "../../components/Auth/AuthInput";
import PasswordInput from "../../components/Auth/PasswordInput";
import RoleSwitch from "../../components/Auth/RoleSwitch";
import Checkbox from "../../components/Auth/Checkbox";
import SubmitButton from "../../components/Auth/SubmitButton";
import SocialLogin from "../../components/Auth/SocialLogin";
import AuthFooter from "../../components/Auth/AuthFooter";
import VendorTypeDropdown from "../../components/Auth/VendorTypeDropdown";

import "./Signup.css";

function Signup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { register } = useAuth();

  const initialRole =
    searchParams.get("role") === "vendor" ? "vendor" : "customer";

  const [role, setRole] = useState(initialRole);
  const [vendorType, setVendorType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = await register(formData, role);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Create Amazing Events."
      description="Plan, manage, and celebrate unforgettable moments with EVENTREE."
    >
      <AuthCard>
        <h2>Create an account</h2>

        <p className="auth-subtitle">
          Start your journey and organize unforgettable events.
        </p>

        <RoleSwitch
          role={role}
          setRole={setRole}
          customerText="Customer"
          vendorText="Vendor"
        />

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            id="name"
            label="Full Name"
            placeholder="John Doe"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
          />

          <AuthInput
            id="email"
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />

          <AuthInput
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+880 1XXXXXXXXX"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
          />

          {role === "vendor" && (
            <VendorTypeDropdown
              value={vendorType}
              onChange={(e) => setVendorType(e.target.value)}
              required
            />
          )}

          <div className="password-row">
            <PasswordInput
              id="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <Checkbox
            text="I agree to the Terms of Service and Privacy Policy."
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <SubmitButton
            text="Create Account"
            loading={loading}
          />
        </form>

        <SocialLogin />

        <AuthFooter
          text="Already have an account?"
          linkText="Login"
          link="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default Signup;