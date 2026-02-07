import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendar, FaTrophy, FaClock, FaUserCheck, FaArrowRight, FaChartLine } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
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
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-gray font-semibold">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Hero Section */}
            <div className="relative bg-gradient-to-br from-primary via-primary-dark to-accent text-white rounded-2xl p-8 overflow-hidden shadow-xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        {/* <HiSparkles className="text-yellow-300 text-2xl" /> */}
                        <span className="text-white/80 font-semibold">{timeGreeting}</span>
                    </div>
                    {/* <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Welcome back, {user?.name}!
                    </h1> */}
                    {/* <p className="text-white/90 text-lg mb-6">
                        Here's what's happening with your {roleTitle} account today.
                    </p> */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/dashboard/profile"
                            className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg inline-flex items-center gap-2"
                        >
                            View Profile
                            <FaArrowRight />
                        </Link>
                        <Link
                            to="/events"
                            className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/30"
                        >
                            Browse Events
                        </Link>
                    </div>
                </div>
            </div>

            {/* Admin/Moderator Stats */}
            {hasRole(['admin', 'moderator']) && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-dark mb-2">Overview Statistics</h2>
                        <p className="text-gray">Quick insights about your platform</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaUsers className="text-2xl text-blue-600" />
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    +12%
                                </span>
                            </div>
                            <h3 className="text-gray text-sm mb-1 font-medium">Total Users</h3>
                            <p className="font-bold text-4xl text-dark mb-1">{stats.totalUsers || 0}</p>
                            <p className="text-xs text-gray">All registered users</p>
                        </div>

                        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaUserCheck className="text-2xl text-teal-600" />
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    Active
                                </span>
                            </div>
                            <h3 className="text-gray text-sm mb-1 font-medium">Active Members</h3>
                            <p className="font-bold text-4xl text-dark mb-1">{stats.activeMembers || 0}</p>
                            <p className="text-xs text-gray">Verified members</p>
                        </div>

                        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaClock className="text-2xl text-yellow-600" />
                                </div>
                                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                                    Pending
                                </span>
                            </div>
                            <h3 className="text-gray text-sm mb-1 font-medium">Pending Requests</h3>
                            <p className="font-bold text-4xl text-dark mb-1">{stats.pendingMemberships || 0}</p>
                            <p className="text-xs text-gray">Awaiting approval</p>
                        </div>

                        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaTrophy className="text-2xl text-purple-600" />
                                </div>
                                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                    Total
                                </span>
                            </div>
                            <h3 className="text-gray text-sm mb-1 font-medium">Total Members</h3>
                            <p className="font-bold text-4xl text-dark mb-1">{stats.totalMembers || 0}</p>
                            <p className="text-xs text-gray">All members</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Regular Member Stats */}
            {!hasRole(['admin', 'moderator']) && (
                <div>
                    <div className="mb-6">
                        {/* <h2 className="text-2xl font-bold text-dark mb-2">Your Activity</h2> */}
                        {/* <p className="text-gray">Track your participation and progress</p> */}
                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaUsers className="text-2xl text-blue-600" />
                            </div>
                            <h3 className="text-gray text-sm mb-1 font-medium">Community</h3>
                            <p className="font-bold text-4xl text-dark mb-1">{stats.totalMembers || 0}</p>
                            <p className="text-xs text-gray">Total members</p>
                        </div>

                        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaCalendar className="text-2xl text-teal-600" />
                            </div>
                            <h3 className="text-gray text-sm mb-1 font-medium">My Events</h3>
                            <p className="font-bold text-4xl text-dark mb-1">0</p>
                            <p className="text-xs text-gray">Registered events</p>
                        </div>

                        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaTrophy className="text-2xl text-purple-600" />
                            </div>
                            <h3 className="text-gray text-sm mb-1 font-medium">Achievements</h3>
                            <p className="font-bold text-4xl text-dark mb-1">0</p>
                            <p className="text-xs text-gray">Earned badges</p>
                        </div>
                    </div> */}
                </div>
            )}

            {/* Pending User Notice */}
            {hasRole('user') && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200 shadow-md">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaClock className="text-4xl text-white" />
                        </div> */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="font-bold text-2xl text-dark mb-2">
                                Membership Under Review
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Your membership application is currently being reviewed by our team.
                                You'll receive a notification once it's approved!
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-xl text-sm font-semibold">
                                💡 <span>Tip: Complete your profile to speed up approval</span>
                            </div>
                        </div>
                        <Link
                            to="/dashboard/profile"
                            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg flex items-center gap-2"
                        >
                            Complete Profile
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-dark mb-2">Quick Actions</h2>
                    <p className="text-gray">Frequently used features</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        to="/dashboard/profile"
                        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            {/* <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <FaUsers className="text-2xl text-primary" />
                            </div> */}
                            <FaArrowRight className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="font-bold text-lg text-dark mb-1">My Profile</h3>
                        <p className="text-sm text-gray">View and edit your information</p>
                    </Link>

                    <Link
                        to="/events"
                        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            {/* <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                                <FaCalendar className="text-2xl text-accent" />
                            </div> */}
                            <FaArrowRight className="text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="font-bold text-lg text-dark mb-1">Browse Events</h3>
                        <p className="text-sm text-gray">Discover upcoming activities</p>
                    </Link>

                    <Link
                        to="/dashboard/achievements"
                        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            {/* <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <FaTrophy className="text-2xl text-purple-600" />
                            </div> */}
                            <FaArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="font-bold text-lg text-dark mb-1">Achievements</h3>
                        <p className="text-sm text-gray">View your accomplishments</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
