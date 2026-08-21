import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSuccess(true);

    
    setTimeout(() => {
      navigate("/login");
    }, 2500);
  };

  return (
    <div className="rp-page">
      <div className="rp-card">
        <h1>Reset Password</h1>

        <p className="rp-subtitle">
          Create a new password for your Eventree account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="rp-input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="rp-input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="rp-error">
              {error}
            </p>
          )}

          {success && (
            <div className="rp-success">
              Password reset successfully! Redirecting you to the login page...
            </div>
          )}

          <button className="rp-button" type="submit">
            Reset Password
          </button>
        </form>

        <div className="rp-back-link">
          <Link to="/login">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;