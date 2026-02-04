import api from './api';

// Get all users (Admin/Moderator only)
export const getAllUsers = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.role) params.append('role', filters.role);
    if (filters.membershipStatus) params.append('membershipStatus', filters.membershipStatus);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
};

// Get single user
export const getUser = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

// Update user role (Admin/President/GS only)
export const updateUserRole = async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
};

// Update membership status (Admin/Moderator/President/GS)
export const updateMembershipStatus = async (userId, membershipStatus) => {
    const response = await api.put(`/users/${userId}/membership`, { membershipStatus });
    return response.data;
};

// Update user profile
export const updateUser = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
};

// Delete user (Admin only)
export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};

// Get dashboard stats
export const getDashboardStats = async () => {
    const response = await api.get('/users/dashboard/stats');
    return response.data;
};
