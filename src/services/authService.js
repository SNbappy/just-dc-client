import api from './api';

// Register new user
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// Login user
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
        currentPassword,
        newPassword,
    });
    return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

// Reset password
export const resetPassword = async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
    });
    return response.data;
};
