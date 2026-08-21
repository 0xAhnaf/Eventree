import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassPage.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSuccess(true);
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <h1>Forgot Password?</h1>

        <p className="fp-subtitle">
          Enter the email associated with your account and we'll send you a
          password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="fp-input-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p className="fp-error">
              {error}
            </p>
          )}

          {success && (
            <div className="fp-success">
              If an account exists with this email, a reset link has been sent.
            </div>
          )}

          <button type="submit" className="fp-button">
            Send Reset Link
          </button>
        </form>

        <div className="fp-back-link">
          <Link to="/login">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;