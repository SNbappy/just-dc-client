import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FaTachometerAlt, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { NAV_LINKS } from "../../utils/constants";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    const isTopManagement =
        user && ["admin", "president", "general_secretary", "moderator"].includes(user.role);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">JDC</span>
                        </div>
                        <span className="font-heading font-bold text-xl text-dark hidden sm:block">
                            JUST Debate Club
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-gray hover:text-primary"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        {/* User Dashboard */}
                        {isAuthenticated && (
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `font-medium transition-colors duration-200 flex items-center gap-1 ${isActive ? "text-primary" : "text-gray hover:text-primary"
                                    }`
                                }
                            >
                                <FaUserCircle />
                                Dashboard
                            </NavLink>
                        )}

                        {/* Management Shortcut (your app routes are /dashboard/manage/*) */}
                        {isAuthenticated && isTopManagement && (
                            <NavLink
                                to="/dashboard/manage/users"
                                className={({ isActive }) =>
                                    `font-medium transition-colors duration-200 flex items-center gap-1 ${isActive ? "text-primary" : "text-gray hover:text-primary"
                                    }`
                                }
                            >
                                <FaTachometerAlt />
                                Manage
                            </NavLink>
                        )}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <div className="text-right">
                                    <p className="text-dark text-sm font-medium">{user?.name}</p>
                                    <p className="text-gray text-xs capitalize">
                                        {user?.role?.replaceAll("_", " ")}
                                    </p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-primary font-medium hover:text-primary-dark transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200"
                                >
                                    Join Us
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-dark hover:text-primary transition-colors duration-200"
                    >
                        {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-gray-light">
                        <div className="px-4 py-4 space-y-3">
                            {NAV_LINKS.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-gray hover:text-primary"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            {isAuthenticated && (
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 font-medium transition-colors duration-200 flex items-center gap-2 ${isActive ? "text-primary" : "text-gray hover:text-primary"
                                        }`
                                    }
                                >
                                    <FaUserCircle />
                                    Dashboard
                                </NavLink>
                            )}

                            {isAuthenticated && isTopManagement && (
                                <NavLink
                                    to="/dashboard/manage/users"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 font-medium transition-colors duration-200 flex items-center gap-2 ${isActive ? "text-primary" : "text-gray hover:text-primary"
                                        }`
                                    }
                                >
                                    <FaTachometerAlt />
                                    Management
                                </NavLink>
                            )}

                            {/* Mobile Auth */}
                            <div className="pt-4 border-t border-gray-light space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <div className="py-2">
                                            <p className="text-dark text-sm font-medium">{user?.name}</p>
                                            <p className="text-gray text-xs capitalize">
                                                {user?.role?.replaceAll("_", " ")}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary-dark transition-colors duration-200"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block text-center text-primary font-medium py-2 border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block text-center bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200"
                                        >
                                            Join Us
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
