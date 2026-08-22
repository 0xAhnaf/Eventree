import { Link } from "react-router-dom";
import logo from "../../assets/eventree-logo.png";
import authBg from "../../assets/auth_bg.png";

function AuthLayout({ title, description, children }) {
  return (
    <div className="auth-page">
      <div
        className="auth-left"
        style={{
          backgroundImage: `
                        linear-gradient(
                            rgba(2, 44, 34, 0.65),
                            rgba(11, 61, 47, 0.65)
                        ),
                        url(${authBg})
                    `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
          <span>EVENTREE</span>
        </Link>

        <div className="hero">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="copyright">
          © 2026 EVENTREE. ORGANIC ELEGANCE IN EVERY DETAIL.
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-container">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
