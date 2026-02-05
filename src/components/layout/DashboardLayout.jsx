// src/components/layout/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar (Mobile) */}
                <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-dark hover:text-primary"
                        >
                            <FaBars size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-primary">JUST Debate Club</h1>
                        <div className="w-6" /> {/* Spacer */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center">
                    <p className="text-sm text-gray">
                        © {new Date().getFullYear()} JUST Debate Club. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
