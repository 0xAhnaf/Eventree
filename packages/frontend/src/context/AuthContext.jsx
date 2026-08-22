import { createContext, useContext, useState } from "react";
import { markVendorOnboardingRequired } from "../utils/vendorProfileStorage.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("eventree_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (identifier, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "The provided credentials are incorrect.",
        };
      }

      const sessionUser = data.user;

      localStorage.setItem("eventree_token", data.token);
      localStorage.setItem("eventree_user", JSON.stringify(sessionUser));

      setUser(sessionUser);

      return {
        success: true,
        user: sessionUser,
      };
    } catch (error) {
      return {
        success: false,
        message: "Could not connect to the server.",
      };
    }
  };

  const register = async (formData, role) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0]?.[0];

          return {
            success: false,
            message: firstError || "Registration failed.",
          };
        }

        return {
          success: false,
          message: data.message || "Registration failed.",
        };
      }

      const sessionUser = data.user;

      localStorage.setItem("eventree_token", data.token);
      localStorage.setItem("eventree_user", JSON.stringify(sessionUser));

      if (sessionUser.role === "vendor") {
        markVendorOnboardingRequired(sessionUser);
      }

      setUser(sessionUser);

      return {
        success: true,
        user: sessionUser,
      };
    } catch (error) {
      return {
        success: false,
        message: "Could not connect to the server.",
      };
    }
  };

  const loginWithGoogle = async (googleAccessToken, role) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/google/callback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_token: googleAccessToken,
            role,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Google authentication failed.",
        };
      }

      const sessionUser = data.user;

      localStorage.setItem("eventree_token", data.token);
      localStorage.setItem("eventree_user", JSON.stringify(sessionUser));

      const isNewGoogleVendor =
        sessionUser.role === "vendor" &&
        (data.is_new_user === true || data.created === true);

      if (isNewGoogleVendor) {
        markVendorOnboardingRequired(sessionUser);
      }

      setUser(sessionUser);

      return {
        success: true,
        user: sessionUser,
      };
    } catch (error) {
      return {
        success: false,
        message: "Could not connect to the server.",
      };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("eventree_token");

    try {
      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    setUser(null);
    localStorage.removeItem("eventree_user");
    localStorage.removeItem("eventree_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
