import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                setUser(JSON.parse(userData));
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            // TEMPORARY MOCK LOGIN - Remove when backend is ready
            // Accept any email/password for testing
            const mockUser = {
                _id: '1',
                name: 'Admin User',
                email: email,
                role: 'admin'
            };

            const mockToken = 'mock-jwt-token-12345';

            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            setUser(mockUser);

            return { success: true };

            // UNCOMMENT THIS WHEN BACKEND IS READY:
            // const response = await api.post('/auth/login', { email, password });
            // const { token, user } = response.data;
            // localStorage.setItem('token', token);
            // localStorage.setItem('user', JSON.stringify(user));
            // setUser(user);
            // return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
