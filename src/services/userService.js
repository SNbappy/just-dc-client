import api from './api';

export const getAllUsers = async (filter = {}) => {
    const params = {};
    if (filter.role) params.role = filter.role;
    if (filter.membershipStatus) params.membershipStatus = filter.membershipStatus;
    if (filter.search) params.search = filter.search;

    const res = await api.get('/users', { params });
    return res.data;
};

export const updateUserRole = async (userId, role) => {
    const res = await api.put(`/users/${userId}/role`, { role });
    return res.data;
};

export const updateMembershipStatus = async (userId, membershipStatus) => {
    const res = await api.put(`/users/${userId}/membership`, { membershipStatus });
    return res.data;
};

export const deleteUser = async (userId) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
};
