import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker, HiSparkles, HiClock } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const contactInfo = [
        {
            icon: HiMail,
            title: 'Email Address',
            info: 'contact@justdc.com',
            subInfo: 'info@justdc.com',
            link: 'mailto:contact@justdc.com',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: HiPhone,
            title: 'Phone Number',
            info: '+880 123 456 789',
            subInfo: '+880 987 654 321',
            link: 'tel:+880123456789',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: HiLocationMarker,
            title: 'Our Location',
            info: 'JUST TSC Campus',
            subInfo: 'Churamonkathi, Jashore',
            link: 'https://www.google.com/maps/dir//Jashore+University+of+Science+and+Technology,+Churamonkathi,+Jashore-7408,+Bangladesh',
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: HiClock,
            title: 'Office Hours',
            info: 'Not Fixed',
            // subInfo: 'Sat: 10AM - 4PM',
            link: null,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    const socialLinks = [
        { icon: FaFacebook, link: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
        { icon: FaTwitter, link: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
        { icon: FaInstagram, link: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
        { icon: FaLinkedin, link: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call - Replace with your actual API endpoint
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });

            setTimeout(() => setSuccess(false), 5000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative py-24 bg-fixed bg-cover bg-center"
                style={{ backgroundImage: 'url(/sticky.jpg)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-accent/95"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white font-semibold text-xs uppercase tracking-wider rounded-full mb-6">
                            <HiSparkles />
                            <span>Get In Touch</span>
                        </div>
                        <h1 className="font-heading font-bold text-5xl md:text-6xl text-white mb-6">
                            Contact Us
                        </h1>
                        <p className="text-white/90 text-xl max-w-3xl mx-auto">
                            Have questions or want to join our community? We'd love to hear from you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((contact, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                            >
                                <div className={`w-14 h-14 ${contact.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                                    <contact.icon className={`text-2xl ${contact.iconColor}`} />
                                </div>
                                <h3 className="font-bold text-lg text-dark mb-2">
                                    {contact.title}
                                </h3>
                                {contact.link ? (
                                    <a
                                        href={contact.link}
                                        target={contact.link.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary-dark font-semibold text-sm block mb-1 transition-colors"
                                    >
                                        {contact.info}
                                    </a>
                                ) : (
                                    <p className="text-gray-700 font-semibold text-sm mb-1">
                                        {contact.info}
                                    </p>
                                )}
                                <p className="text-gray-500 text-sm">
                                    {contact.subInfo}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Social Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
                                <div className="mb-8">
                                    <h2 className="font-heading font-bold text-3xl text-dark mb-3">
                                        Send Us a Message
                                    </h2>
                                    <p className="text-gray-600">
                                        Fill out the form below and we'll get back to you within 24 hours.
                                    </p>
                                </div>

                                {success && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <p className="text-green-700 font-semibold">
                                            ✓ Message sent successfully! We'll get back to you soon.
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-dark mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-dark mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-dark mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="+880 123 456 789"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-dark mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="membership">Membership Inquiry</option>
                                                <option value="event">Event Information</option>
                                                <option value="collaboration">Collaboration</option>
                                                <option value="general">General Question</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-dark mb-2">
                                            Your Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="6"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                            placeholder="Tell us how we can help you..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Social Media */}
                            <div className="bg-white rounded-2xl shadow-md p-8">
                                <h3 className="font-heading font-bold text-2xl text-dark mb-4">
                                    Follow Us
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Stay connected with us on social media for updates and news.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:text-white transition-all group ${social.color}`}
                                        >
                                            <social.icon className="text-2xl" />
                                            <span className="font-semibold text-sm">{social.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ Quick Links */}
                            {/* <div className="bg-gradient-to-br from-primary to-accent rounded-2xl shadow-md p-8 text-white">
                                <h3 className="font-heading font-bold text-2xl mb-4">
                                    Quick Help
                                </h3>
                                <p className="mb-6 text-white/90">
                                    Looking for quick answers? Check out our FAQ section.
                                </p>
                                <Link
                                    to="/faq"
                                    className="block w-full px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-all text-center"
                                >
                                    View FAQs
                                </Link>
                            </div> */}

                            {/* Office Hours */}
                            {/* <div className="bg-white rounded-2xl shadow-md p-8">
                                <h3 className="font-heading font-bold text-2xl text-dark mb-4">
                                    Visit Our Office
                                </h3>
                                <div className="space-y-3 text-gray-600">
                                    <p className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        <span className="font-semibold">Monday - Friday:</span>
                                        <span>9AM - 6PM</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                                        <span className="font-semibold">Saturday:</span>
                                        <span>10AM - 4PM</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        <span className="font-semibold">Sunday:</span>
                                        <span>Closed</span>
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            {/* Map Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-heading font-bold text-4xl text-dark mb-4">
                            Find Us On Map
                        </h2>
                        <p className="text-gray-600 text-lg mb-2">
                            Visit us at JUST TSC Campus
                        </p>
                        <p className="text-gray-500">
                            Churamonkathi, Ambottola, Jashore-7408, Bangladesh
                        </p>
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-lg h-96">
                        <iframe
                            src="https://maps.google.com/maps?q=23.2334345,89.1254175&hl=en&z=18&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Jashore University of Science and Technology - JUST TSC Campus"
                        ></iframe>
                    </div>

                    {/* Get Directions Button */}
                    <div className="text-center mt-8">
                        <a
                            href="https://www.google.com/maps/place/Jashore+University+of+Science+and+Technology/@23.2334345,89.1254175,18z"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
                        >
                            <HiLocationMarker className="text-xl" />
                            <span>Get Directions</span>
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;
