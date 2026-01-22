import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaHome, FaCalendar, FaImages, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FaChartBar },
        { name: 'Events', path: '/admin/events', icon: FaCalendar },
        { name: 'Members', path: '/admin/members', icon: FaUsers },
        { name: 'Gallery', path: '/admin/gallery', icon: FaImages },
        { name: 'Settings', path: '/admin/settings', icon: FaCog },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Top Navbar */}
            <nav className="bg-white shadow-md sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden text-gray-600 hover:text-primary"
                            >
                                {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </button>

                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">JDC</span>
                                </div>
                                <span className="font-heading font-bold text-xl text-dark hidden sm:block">
                                    Admin Panel
                                </span>
                            </Link>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                            >
                                <FaHome />
                                <span className="hidden sm:inline">View Site</span>
                            </Link>

                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-dark">{user?.name || 'Admin'}</p>
                                    <p className="text-xs text-gray">{user?.email || 'admin@just.com'}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">

                {/* Sidebar */}
                <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 z-30 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}>
                    <div className="p-6">
                        <nav className="space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-primary hover:text-white transition-all group"
                                >
                                    <item.icon className="text-lg" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-8"
                            >
                                <FaSignOutAlt className="text-lg" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
