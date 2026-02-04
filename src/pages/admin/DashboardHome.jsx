import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendar, FaImages, FaTrophy, FaClock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthProvider';
import api from '../../services/api';

const DashboardHome = () => {
    const { user, hasRole } = useAuth();
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/users/dashboard/stats');
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

        let roleTitle = '';
        switch (user?.role) {
            case 'admin':
                roleTitle = 'Administrator';
                break;
            case 'moderator':
                roleTitle = 'Moderator';
                break;
            case 'president':
                roleTitle = 'President';
                break;
            case 'general_secretary':
                roleTitle = 'General Secretary';
                break;
            case 'member':
                roleTitle = 'Member';
                break;
            default:
                roleTitle = 'User';
        }

        return { timeGreeting, roleTitle };
    };

    const { timeGreeting, roleTitle } = getGreeting();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-8 mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {timeGreeting}, {user?.name}! 👋
                </h1>
                <p className="text-white text-opacity-90 text-lg">
                    Welcome back to your {roleTitle} dashboard
                </p>
            </div>

            {/* Stats for Admin/Moderator */}
            {hasRole(['admin', 'moderator']) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <FaUsers className="text-2xl text-blue-600" />
                        </div>
                        <h3 className="text-gray text-sm mb-1">Total Users</h3>
                        <p className="font-heading font-bold text-3xl text-dark">{stats.totalUsers || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                            <FaUsers className="text-2xl text-teal-600" />
                        </div>
                        <h3 className="text-gray text-sm mb-1">Active Members</h3>
                        <p className="font-heading font-bold text-3xl text-dark">{stats.activeMembers || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                            <FaClock className="text-2xl text-yellow-600" />
                        </div>
                        <h3 className="text-gray text-sm mb-1">Pending Memberships</h3>
                        <p className="font-heading font-bold text-3xl text-dark">{stats.pendingMemberships || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <FaTrophy className="text-2xl text-purple-600" />
                        </div>
                        <h3 className="text-gray text-sm mb-1">Total Members</h3>
                        <p className="font-heading font-bold text-3xl text-dark">{stats.totalMembers || 0}</p>
                    </div>
                </div>
            )}

            {/* Stats for Regular Users/Members */}
            {!hasRole(['admin', 'moderator']) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <FaUsers className="text-2xl text-blue-600" />
                        </div>
                        <h3 className="text-gray text-sm mb-1">Total Members</h3>
                        <p className="font-heading font-bold text-3xl text-dark">{stats.totalMembers || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                            <FaCalendar className="text-2xl text-teal-600" />
                        </div>
                        <h3 className="text-gray text-sm mb-1">My Events</h3>
                        <p className="font-heading font-bold text-3xl text-dark">0</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <FaTrophy className="text-2xl text-purple-600" />
                        </div>
                        <h3 className="text-gray text-sm mb-1">Achievements</h3>
                        <p className="font-heading font-bold text-3xl text-dark">0</p>
                    </div>
                </div>
            )}

            {/* Pending User Notice */}
            {hasRole('user') && (
                <div className="bg-white rounded-2xl p-8 shadow-md text-center mb-8">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaClock className="text-4xl text-yellow-600" />
                    </div>
                    <h2 className="font-heading font-bold text-2xl text-dark mb-3">
                        Membership Application Pending
                    </h2>
                    <p className="text-gray mb-6 max-w-md mx-auto">
                        Your membership application is currently under review. You'll be notified once it's approved.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                        <p className="text-blue-800 text-sm">
                            💡 <strong>Tip:</strong> Complete your profile information to speed up the approval process!
                        </p>
                    </div>
                </div>
            )}

            {/* Role Badge */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="font-heading font-bold text-xl text-dark mb-4">Your Profile</h2>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-dark">{user?.name}</h3>
                        <p className="text-gray">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-semibold capitalize">
                            {roleTitle}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
