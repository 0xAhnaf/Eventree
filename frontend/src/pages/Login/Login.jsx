import { useState } from "react";
import AuthLayout from "../../components/Auth/AuthLayout";
import AuthCard from "../../components/Auth/AuthCard";
import AuthInput from "../../components/Auth/AuthInput";
import PasswordInput from "../../components/Auth/PasswordInput";
import RoleSwitch from "../../components/Auth/RoleSwitch";
import Checkbox from "../../components/Auth/Checkbox";
import SubmitButton from "../../components/Auth/SubmitButton";
import SocialLogin from "../../components/Auth/SocialLogin";
import AuthFooter from "../../components/Auth/AuthFooter";

import "./Login.css";

function Login() {
    const [role, setRole] = useState("customer");

    return (
        <AuthLayout
            title="Welcome Back."
            description="Sign in to continue managing your events with EVENTREE."
        >
            <AuthCard>
                <h2>Login</h2>
                <p>Welcome back! Please sign in.</p>

                

                <form>
                    <AuthInput
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="example@email.com"
                    />

                    <PasswordInput
                        id="password"
                        label="Password"
                    />

                    <Checkbox
                        text="Remember me"
                    />

                    <SubmitButton text="Login" />
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