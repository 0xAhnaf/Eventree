import { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);

// Hardcoded Demo Users
export const DEMO_USERS = [
  {
    id: "usr_client",
    name: "Demo Client",
    email: "client@eventree.com",
    phone: "01700000001",
    password: "password123",
    role: "client",
    redirectTo: "/browse-vendor",
  },
  {
    id: "usr_vendor",
    name: "Demo Vendor",
    email: "vendor@eventree.com",
    phone: "01700000002",
    password: "password123",
    role: "vendor",
    redirectTo: "/vendor",
  },
  {
    id: "usr_admin",
    name: "Demo Admin",
    email: "admin@eventree.com",
    phone: "01700000003",
    password: "password123",
    role: "admin",
    redirectTo: "/admin",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("eventree_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (identifier, password) => {
    const cleanIdentifier = identifier.trim().toLowerCase();

    // Match against either Email OR Phone number
    const foundUser = DEMO_USERS.find(
      (u) =>
        (u.email.toLowerCase() === cleanIdentifier || u.phone === cleanIdentifier) &&
        u.password === password
    );

    if (foundUser) {
      const sessionUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role,
        redirectTo: foundUser.redirectTo,
      };
      setUser(sessionUser);
      localStorage.setItem("eventree_user", JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }

    return {
      success: false,
      message: "Invalid credentials. Try using one of the demo user credentials.",
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eventree_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);