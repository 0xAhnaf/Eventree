import { useState } from "react";
import { useSearchParams } from "react-router-dom";

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

  const initialRole =
    searchParams.get("role") === "vendor" ? "vendor" : "customer";

  const [role, setRole] = useState(initialRole);
  const [vendorType, setVendorType] = useState("");

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

        <form className="auth-form">
          <AuthInput
            id="name"
            label="Full Name"
            placeholder="John Doe"
            autoComplete="name"
          />

          <AuthInput
            id="email"
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            autoComplete="email"
          />

          <AuthInput
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+880 1XXXXXXXXX"
            autoComplete="tel"
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
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
            />
          </div>

          <Checkbox
            text="I agree to the Terms of Service and Privacy Policy."
            required
          />

          <SubmitButton text="Create Account" />
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