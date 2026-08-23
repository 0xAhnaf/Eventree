import { Link, useSearchParams } from "react-router-dom";
import "./EmailVerified.css";

const STATUS_CONTENT = {
  success: {
    icon: "✓",
    iconClass: "success",
    title: "Email Verified!",
    subtitle:
      "Your email has been successfully verified. You can now log in and start using your Eventree account.",
  },
  already: {
    icon: "✓",
    iconClass: "already",
    title: "Already Verified",
    subtitle: "This email was already verified. You're all set to log in.",
  },
  invalid: {
    icon: "!",
    iconClass: "invalid",
    title: "Verification Failed",
    subtitle:
      "This verification link is invalid or has expired. Please log in and request a new one.",
  },
};

function EmailVerified() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const content = STATUS_CONTENT[status] || STATUS_CONTENT.invalid;

  return (
    <div className="ev-page">
      <div className="ev-card">
        <div className={`ev-icon ${content.iconClass}`}>
          <span>{content.icon}</span>
        </div>

        <h1>{content.title}</h1>

        <p className="ev-subtitle">{content.subtitle}</p>

        <Link to="/login" className="ev-button">
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default EmailVerified;
