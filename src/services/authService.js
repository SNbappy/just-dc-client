import api from "./api";

// Register new user
export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

// Login user
export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
};

// Logout user (local only)
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

// Update user details (matches backend: /updatedetails)
export const updateDetails = async (payload) => {
    const response = await api.put("/auth/updatedetails", payload);
    return response.data;
};

// Update password (matches backend: /updatepassword)
export const updatePassword = async (currentPassword, newPassword) => {
    const response = await api.put("/auth/updatepassword", {
        currentPassword,
        newPassword,
    });
    return response.data;
};
