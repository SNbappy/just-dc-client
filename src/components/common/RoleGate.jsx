import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_PERMISSIONS } from "../../config/rolePermissions";

const RoleGate = ({ permission, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
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
                        You don’t have permission for this action.
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
