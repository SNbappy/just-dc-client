import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaCalendar,
    FaUsers,
    FaImage,
    FaUsersCog,
    FaCreditCard,
    FaCog,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaUser,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthProvider';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
        { name: 'Events', path: '/admin/events', icon: FaCalendar },
        { name: 'Members', path: '/admin/members', icon: FaUsers },
        { name: 'Gallery', path: '/admin/gallery', icon: FaImage },
        { name: 'User Management', path: '/admin/users', icon: FaUsersCog },
        { name: 'Payments', path: '/admin/payments', icon: FaCreditCard },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-gradient-to-b from-primary to-secondary text-white transition-all duration-300 ease-in-out flex flex-col`}
            >
                {/* Logo & Toggle */}
                <div className="p-4 flex items-center justify-between border-b border-white/20">
                    {sidebarOpen && (
                        <Link to="/admin/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-primary font-bold">JDC</span>
                            </div>
                            <span className="font-heading font-bold text-lg">JUST DC</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                    >
                        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-white/20">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <FaUser />
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user?.name}</p>
                                <p className="text-xs text-white/70 capitalize truncate">
                                    {user?.role?.replace('_', ' ')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-white text-primary font-semibold shadow-md'
                                        : 'text-white hover:bg-white/10'
                                    }`
                                }
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.name}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition"
                    >
                        <FaSignOutAlt size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-dark">
                            Admin Dashboard
                        </h1>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-gray hover:text-primary transition"
                            >
                                View Site
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
