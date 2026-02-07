import { Link, useLocation } from 'react-router-dom';
import { DASHBOARD_MENU, getAccessibleMenuItems } from '../../config/dashboardMenu';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = getAccessibleMenuItems(user?.role);

    const handleLogout = () => {
        logout();
        onClose?.();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-primary via-primary-dark to-primary
                    transition-transform duration-300 z-50 flex flex-col shadow-2xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header with Logo */}
                <div className="p-6 border-b border-white/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                <img src="/logo.jpg" alt="JUST DC" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">JUST DC</h2>
                                <p className="text-white/70 text-xs">Dashboard</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-white hover:text-white/80 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* User Info Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">
                                    {user?.name}
                                </p>
                                <p className="text-white/70 text-xs truncate">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-lg">
                            <HiSparkles className="text-yellow-300 text-sm" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {user?.role?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.key}
                                    to={item.path}
                                    onClick={onClose}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl
                                        transition-all duration-200 font-medium group
                                        ${isActive
                                            ? 'bg-white text-primary shadow-lg scale-105'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-primary' : 'text-white/80 group-hover:text-white'}`} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                   bg-red-500/20 text-white hover:bg-red-500/30 font-medium
                                   transition-all duration-200 group"
                    >
                        <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
