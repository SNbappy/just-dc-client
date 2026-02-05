// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { DASHBOARD_MENU, getAccessibleMenuItems } from '../../config/dashboardMenu';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

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
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 
                    transition-transform duration-300 z-50 flex flex-col
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-gray hover:text-dark"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <div className="px-3 py-2 bg-primary/10 rounded-lg">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                            {user?.role?.replace('_', ' ')}
                        </p>
                        <p className="text-sm font-medium text-dark truncate mt-1">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray truncate">{user?.email}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.key}
                                to={item.path}
                                onClick={onClose}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl mb-2 
                                    transition-all font-medium
                                    ${isActive
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-gray hover:bg-gray-100 hover:text-dark'
                                    }
                                `}
                            >
                                <Icon className="text-lg flex-shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                   bg-red-50 text-red-600 hover:bg-red-100 font-medium
                                   transition-all"
                    >
                        <FaSignOutAlt className="text-lg" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
