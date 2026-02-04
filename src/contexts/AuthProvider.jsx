import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Export useAuth hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // FIXED: Just store the data, don't make API call
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
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

    // Check if user has specific role
    const hasRole = (roles) => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };

    // Check if user is admin or moderator
    const isAdminOrModerator = () => {
        return hasRole(['admin', 'moderator']);
    };

    // Check if user is executive (President, General Secretary, Admin, Moderator)
    const isExecutive = () => {
        return hasRole(['president', 'general_secretary', 'moderator', 'admin']);
    };

    // Check if user is a member
    const isMember = () => {
        return hasRole(['member', 'general_secretary', 'president', 'moderator', 'admin']);
    };

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
