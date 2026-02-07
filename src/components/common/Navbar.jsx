// src/components/common/Navbar.jsx - CLEAN VERSION
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [moreDropdown, setMoreDropdown] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    // ✅ Primary Navigation (Always visible)
    const primaryLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    // ✅ Secondary Navigation (In "More" dropdown)
    const secondaryLinks = [
        { name: 'Track Registration', path: '/track-registration' },
        { name: 'Verify Certificate', path: '/verify-certificate' },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <span className=""><img src="/logo.jpg" alt="" /></span>
                        </div>
                        <span className="font-heading font-bold text-2xl text-dark hidden sm:block">
                            JUST Debate Club
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {/* Primary Links */}
                        {primaryLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `font-medium transition-colors duration-200 ${
                                        isActive ? "text-primary" : "text-gray hover:text-primary"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        {/* More Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setMoreDropdown(!moreDropdown)}
                                onBlur={() => setTimeout(() => setMoreDropdown(false), 200)}
                                className="flex items-center gap-1 font-medium text-gray hover:text-primary transition-colors duration-200"
                            >
                                More
                                <HiChevronDown className={`transition-transform ${moreDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {moreDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                                    >
                                        {secondaryLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className="block px-4 py-2 text-gray hover:bg-primary/5 hover:text-primary transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                            isActive 
                                                ? "bg-primary text-white" 
                                                : "text-gray hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    <FaUserCircle />
                                    <span className="hidden xl:inline">{user?.name?.split(' ')[0]}</span>
                                    <span className="xl:hidden">Dashboard</span>
                                </NavLink>
                                <button
                                    onClick={logout}
                                    className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors duration-200 font-medium"
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
                                    className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 font-medium"
                                >
                                    Join Us
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden text-dark hover:text-primary transition-colors duration-200"
                    >
                        {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden bg-white border-t border-gray-100"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {/* Primary Links */}
                            {primaryLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 px-3 rounded-lg font-medium transition-colors duration-200 ${
                                            isActive 
                                                ? "bg-primary/10 text-primary" 
                                                : "text-gray hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            {/* Secondary Links */}
                            <div className="pt-2 border-t border-gray-100">
                                {secondaryLinks.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) =>
                                            `block py-2 px-3 rounded-lg font-medium transition-colors duration-200 ${
                                                isActive 
                                                    ? "bg-primary/10 text-primary" 
                                                    : "text-gray hover:bg-gray-50"
                                            }`
                                        }
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}
                            </div>

                            {/* Dashboard Link (Mobile) */}
                            {isAuthenticated && (
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                                            isActive 
                                                ? "bg-primary/10 text-primary" 
                                                : "text-gray hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    <FaUserCircle />
                                    Dashboard
                                </NavLink>
                            )}

                            {/* Mobile Auth */}
                            <div className="pt-3 border-t border-gray-100 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <div className="py-2 px-3">
                                            <p className="text-dark text-sm font-semibold">{user?.name}</p>
                                            <p className="text-gray text-xs capitalize">
                                                {user?.role?.replaceAll("_", " ")}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary-dark transition-colors duration-200 font-medium"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block text-center text-primary font-medium py-2 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block text-center bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 font-medium"
                                        >
                                            Join Us
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
