// components/common/RoleGate.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// ✅ Role Permissions Map (inline - no need for separate file)
const ROLE_PERMISSIONS = {
    user: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
    ],
    member: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
    ],
    executive_member: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members',
    ],
    general_secretary: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members',
        'manage.users',
    ],
    president: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members',
        'manage.users',
    ],
    moderator: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.users',
    ],
    admin: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members',
        'manage.users',
    ],
};

const RoleGate = ({ permission, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    const allowed = ROLE_PERMISSIONS[user.role]?.includes(permission);

    if (!allowed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-2">403</h2>
                    <p className="text-gray mb-4">
                        You don't have permission for this action.
                    </p>
                    <a href="/dashboard/home" className="btn-primary">
                        Back to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default RoleGate;
