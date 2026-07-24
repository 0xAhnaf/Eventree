import { Link } from "react-router-dom";


function ForgotPasswordLink() {
  return (
    <div className="forgot-password-container">
      <Link to="/forgot-password" className="forgot-password-link">
        Forgot Password?
      </Link>
    </div>
  );
}

export default ForgotPasswordLink;