import { useAuth } from '../../hooks/useAuth';

const DashboardHome = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-dark">Welcome, {user?.name} 👋</h2>
            <p className="text-gray mt-2">
                Your role: <span className="font-semibold">{user?.role}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl border bg-gray-50">
                    <p className="text-sm text-gray">Membership</p>
                    <p className="text-lg font-bold text-dark">{user?.membershipStatus || 'pending'}</p>
                </div>
                <div className="p-4 rounded-xl border bg-gray-50">
                    <p className="text-sm text-gray">Account</p>
                    <p className="text-lg font-bold text-dark">{user?.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="p-4 rounded-xl border bg-gray-50">
                    <p className="text-sm text-gray">Quick</p>
                    <a href="/dashboard/profile" className="text-primary font-semibold hover:underline">
                        Go to profile →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
