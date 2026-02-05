import { useMemo, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { DASHBOARD_MENU } from '../config/dashboardMenu';
import { useAuth } from '../hooks/useAuth';
import { HiMenu, HiX } from 'react-icons/hi';

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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* ===================== DESKTOP SIDEBAR ===================== */}
            <aside className="w-72 hidden md:flex flex-col border-r bg-white">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-dark">Dashboard</h2>
                    <p className="text-sm text-gray mt-1">{user?.name}</p>

                    <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {prettyRole(role)}
                    </span>
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.key}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <Icon className="text-base" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button onClick={logout} className="btn-outline w-full">
                        Logout
                    </button>
                </div>
            </aside>

            {/* ===================== MOBILE DRAWER ===================== */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r">
                        <div className="p-6 border-b flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-dark">Dashboard</h2>
                                <p className="text-sm text-gray mt-1">{user?.name}</p>
                                <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                    {prettyRole(role)}
                                </span>
                            </div>
                            <button onClick={closeMobile} className="text-gray-700 hover:text-dark">
                                <HiX size={26} />
                            </button>
                        </div>

                        <nav className="p-4 space-y-1">
                            {menu.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.key}
                                        to={item.path}
                                        onClick={closeMobile}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <Icon className="text-base" />
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t">
                            <button
                                onClick={() => {
                                    closeMobile();
                                    logout();
                                }}
                                className="btn-outline w-full"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== MAIN AREA ===================== */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="bg-white border-b px-4 py-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <button onClick={toggleMobile} className="md:hidden text-dark hover:text-primary">
                            <HiMenu size={26} />
                        </button>

                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-dark">User Dashboard</h1>
                            <p className="text-sm text-gray">
                                {prettyRole(role)} • {location.pathname}
                            </p>
                        </div>
                    </div>

                    {/* Quick action */}
                    <div className="hidden sm:flex items-center gap-3">
                        <a href="/dashboard/profile" className="btn-primary">
                            My Profile
                        </a>
                    </div>
                </header>

                <main className="p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserDashboardLayout;
