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

const phoneRegex = /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/;

if (
  identifier.startsWith("01") ||
  identifier.startsWith("+880")
) {
  if (!phoneRegex.test(identifier)) {
    setErrorMessage("Please enter a valid phone number ");
    return;
  }
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

  return (
    <AuthLayout
      title="Welcome Back."
      description="Sign in to continue managing your events with EVENTREE."
    >
      <AuthCard>
        <h2>Login</h2>

        <p>Welcome back! Please sign in.</p>

        {errorMessage && (
          <div className="login-error-toast">
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