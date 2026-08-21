import { FcGoogle } from "react-icons/fc";
function SocialLogin() {
    return (
        <>
            <div className="auth-divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <button className="google-btn">
                <FcGoogle className="google-icon" />
                Sign in with Google
            </button>
        </>
    );
}

export default SocialLogin;