import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!hasRole(allowedRoles)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
                    <h2 className="text-2xl font-bold text-dark mb-2">Access Denied</h2>
                    <p className="text-gray mb-6">
                        You don't have permission to access this page.
                    </p>
                    <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default RoleProtectedRoute;
