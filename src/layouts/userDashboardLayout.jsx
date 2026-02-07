import { useMemo, useState } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { DASHBOARD_MENU } from '../config/dashboardMenu';
import { useAuth } from '../hooks/useAuth';
import { HiMenu, HiX, HiHome } from 'react-icons/hi';
import { FaSignOutAlt } from 'react-icons/fa';

const prettyRole = (role = 'user') =>
    role
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

const UserDashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const role = user?.role || 'user';

    const menu = useMemo(() => {
        return DASHBOARD_MENU.filter((m) => Array.isArray(m.roles) && m.roles.includes(role));
    }, [role]);

    const [mobileOpen, setMobileOpen] = useState(false);

    const closeMobile = () => setMobileOpen(false);
    const toggleMobile = () => setMobileOpen((s) => !s);

    // Get current page title from menu
    const currentPage = menu.find(item => item.path === location.pathname);
    const pageTitle = currentPage?.label || 'Dashboard';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* ===================== DESKTOP SIDEBAR ===================== */}
            <aside className="w-72 hidden md:flex flex-col bg-gradient-to-b from-primary via-primary-dark to-primary shadow-2xl">
                {/* User Profile Section */}
                <div className="p-6 border-b border-white/20">
                    <div className="flex flex-col items-center text-center">
                        {/* Profile Image */}
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary font-bold text-4xl shadow-lg mb-4">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Name and Email */}
                        <h2 className="text-xl font-bold text-white mb-1">
                            {user?.name}
                        </h2>
                        <p className="text-white/80 text-sm mb-3 break-all px-2">
                            {user?.email}
                        </p>

                        {/* Role Badge */}
                        <div className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {prettyRole(role)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {/* Home Link */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium group"
                    >
                        <HiHome className="text-xl flex-shrink-0 text-white/80 group-hover:text-white" />
                        <span>Go to Home</span>
                    </Link>

                    {/* Divider */}
                    <div className="h-px bg-white/10 my-2"></div>

                    {/* Dashboard Menu Items */}
                    {menu.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.key}
                                to={item.path}
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
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                   bg-red-500/20 text-white hover:bg-red-500/30 font-medium
                                   transition-all duration-200 group"
                    >
                        <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* ===================== MOBILE DRAWER ===================== */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobile} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-primary via-primary-dark to-primary shadow-2xl">
                        {/* Mobile User Profile */}
                        <div className="p-6 border-b border-white/20">
                            <button onClick={closeMobile} className="absolute top-4 right-4 text-white hover:text-white/80">
                                <HiX size={24} />
                            </button>

                            <div className="flex flex-col items-center text-center pt-8">
                                {/* Profile Image */}
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mb-3"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary font-bold text-3xl shadow-lg mb-3">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Name and Email */}
                                <h2 className="text-lg font-bold text-white mb-1">
                                    {user?.name}
                                </h2>
                                <p className="text-white/80 text-xs mb-3 break-all px-2">
                                    {user?.email}
                                </p>

                                {/* Role Badge */}
                                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    <span className="text-xs font-bold text-white uppercase">
                                        {prettyRole(role)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                            {/* Home Link */}
                            <Link
                                to="/"
                                onClick={closeMobile}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium"
                            >
                                <HiHome className="text-xl" />
                                <span>Go to Home</span>
                            </Link>

                            {/* Divider */}
                            <div className="h-px bg-white/10 my-2"></div>

                            {/* Dashboard Menu */}
                            {menu.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <NavLink
                                        key={item.key}
                                        to={item.path}
                                        onClick={closeMobile}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl
                                            transition-all duration-200 font-medium
                                            ${isActive
                                                ? 'bg-white text-primary shadow-lg'
                                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Icon className="text-xl" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>

                        {/* Mobile Logout */}
                        <div className="p-4 border-t border-white/20">
                            <button
                                onClick={() => {
                                    closeMobile();
                                    logout();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                           bg-red-500/20 text-white hover:bg-red-500/30 font-medium
                                           transition-all"
                            >
                                <FaSignOutAlt className="text-lg" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== MAIN AREA ===================== */}
            <div className="flex-1 flex flex-col">
                {/* Clean Professional Topbar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                    <div className="px-4 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Left: Menu + Title */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleMobile}
                                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                >
                                    <HiMenu size={20} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-dark">{pageTitle}</h1>
                                    <p className="text-sm text-gray hidden sm:block">
                                        Welcome back, {user?.name?.split(' ')[0]}!
                                    </p>
                                </div>
                            </div>

                            {/* Right: User Profile */}
                            <Link
                                to="/dashboard/profile"
                                className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-semibold text-dark">{user?.name}</p>
                                    <p className="text-xs text-gray">{prettyRole(role)}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p className="text-sm text-gray">
                            © {new Date().getFullYear()} JUST Debate Club. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray">
                            <a href="#" className="hover:text-primary transition-colors">Support</a>
                            <span>•</span>
                            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default UserDashboardLayout;
