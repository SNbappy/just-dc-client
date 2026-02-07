import { HiMail, HiPhone, HiLocationMarker, HiSparkles } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const ContactHero = () => {
    const quickContact = [
        {
            icon: HiMail,
            title: 'Email Us',
            info: 'contact@justdc.com',
            link: 'mailto:contact@justdc.com',
        },
        {
            icon: HiPhone,
            title: 'Call Us',
            info: '+880 123 456 789',
            link: 'tel:+880123456789',
        },
        {
            icon: HiLocationMarker,
            title: 'Visit Us',
            info: 'JUST Campus, Jessore',
            link: 'https://maps.google.com',
        },
    ];

    const socialLinks = [
        { icon: FaFacebook, link: '#', color: 'hover:text-blue-400' },
        { icon: FaTwitter, link: '#', color: 'hover:text-sky-400' },
        { icon: FaInstagram, link: '#', color: 'hover:text-pink-400' },
        { icon: FaLinkedin, link: '#', color: 'hover:text-blue-500' },
    ];

    return (
        <section
            className="relative py-24 lg:py-32 overflow-hidden bg-fixed bg-cover bg-center"
            style={{ backgroundImage: 'url(/sticky.jpg)' }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-dark/95 to-accent/95"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl"></div>
            </div>

            {/* Decorative Dots Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Content */}
                <div className="text-center text-white mb-16">
                    <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-white/20 backdrop-blur-md font-semibold text-sm uppercase tracking-wider rounded-full border border-white/30">
                        <HiSparkles className="text-yellow-300" />
                        <span>Get In Touch</span>
                    </div>

                    <h1 className="font-heading font-bold text-5xl lg:text-7xl mb-6 leading-tight">
                        Let's Start a<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-white">
                            Conversation
                        </span>
                    </h1>

                    <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                        Have questions about joining our club? Want to collaborate on an event?
                        We're here to help and would love to hear from you.
                    </p>

                    {/* Social Media Links */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all hover:bg-white/20 hover:scale-110 ${social.color}`}
                            >
                                <social.icon />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Contact Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {quickContact.map((contact, index) => (
                        <a
                            key={index}
                            href={contact.link}
                            target={contact.link.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <contact.icon className="text-3xl text-white" />
                                </div>
                                <h3 className="font-bold text-lg text-white mb-2">
                                    {contact.title}
                                </h3>
                                <p className="text-white/80 text-sm font-medium">
                                    {contact.info}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Bottom Text */}
                <div className="text-center mt-12">
                    <p className="text-white/70 text-sm">
                        Our team typically responds within 24 hours
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactHero;
