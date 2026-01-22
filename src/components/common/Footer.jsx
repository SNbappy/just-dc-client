import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Blog', path: '/blog' },
    ];

    const resources = [
        { name: 'Alumni', path: '/alumni' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms & Conditions', path: '/terms' },
    ];

    const socialLinks = [
        { icon: FaFacebook, url: 'https://facebook.com', label: 'Facebook' },
        { icon: FaTwitter, url: 'https://twitter.com', label: 'Twitter' },
        { icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram' },
        { icon: FaLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: FaYoutube, url: 'https://youtube.com', label: 'YouTube' },
    ];

    return (
        <footer className="bg-dark text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* About Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">JDC</span>
                            </div>
                            <span className="font-heading font-bold text-lg">JUST Debate Club</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Empowering voices, sharpening minds, and fostering critical thinking through the art of debate.
                        </p>
                        {/* Social Media Links */}
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {resources.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-gray-400 text-sm">
                                <HiLocationMarker className="text-primary mt-1" size={20} />
                                <span>Jashore University of Science and Technology, Jashore, Bangladesh</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <HiPhone className="text-primary" size={20} />
                                <span>+880 1234-567890</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <HiMail className="text-primary" size={20} />
                                <span>info@justdebateclub.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} JUST Debate Club. All rights reserved. Built with passion for debate.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
