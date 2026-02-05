import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load from localStorage once
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }
        }

        setLoading(false);
    }, []);

    // Save login
    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // Clear login
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    // Update user in state + localStorage
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const hasRole = (roles) => {
        if (!user) return false;
        return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
    };

    const isAdminOrModerator = () => hasRole(["admin", "moderator"]);

    const isExecutive = () =>
        hasRole(["president", "general_secretary", "moderator", "admin"]);

    const isMember = () =>
        hasRole(["member", "general_secretary", "president", "moderator", "admin"]);

    // ✅ No useMemo -> React Compiler warning gone
    const value = {
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading,
        hasRole,
        isAdminOrModerator,
        isExecutive,
        isMember,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
