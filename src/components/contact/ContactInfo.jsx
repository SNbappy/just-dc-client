import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const ContactInfo = () => {
    const contactDetails = [
        {
            icon: FaMapMarkerAlt,
            title: 'Our Location',
            details: ['Jashore University of Science & Technology', 'Jashore-7408, Bangladesh'],
            color: 'primary',
        },
        {
            icon: FaEnvelope,
            title: 'Email Us',
            details: ['info@justdebateclub.org', 'president@justdebateclub.org'],
            color: 'secondary',
        },
        {
            icon: FaPhone,
            title: 'Call Us',
            details: ['+880 1234-567890', '+880 1987-654321'],
            color: 'primary',
        },
    ];

    const socialLinks = [
        { icon: FaFacebook, url: '#', color: 'bg-blue-600' },
        { icon: FaTwitter, url: '#', color: 'bg-sky-500' },
        { icon: FaInstagram, url: '#', color: 'bg-pink-600' },
        { icon: FaLinkedin, url: '#', color: 'bg-blue-700' },
        { icon: FaYoutube, url: '#', color: 'bg-red-600' },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="font-heading font-bold text-4xl text-dark mb-4">
                        Contact Information
                    </h2>
                    <p className="text-gray text-lg max-w-2xl mx-auto">
                        Find us through any of these channels
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {contactDetails.map((contact, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-16 h-16 bg-${contact.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6`}>
                                <contact.icon className={`text-${contact.color} text-3xl`} />
                            </div>

                            <h3 className="font-heading font-bold text-xl text-dark mb-4">
                                {contact.title}
                            </h3>

                            <div className="space-y-2">
                                {contact.details.map((detail, idx) => (
                                    <p key={idx} className="text-gray leading-relaxed">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Media */}
                <div className="text-center">
                    <h3 className="font-heading font-bold text-2xl text-dark mb-6">
                        Follow Us on Social Media
                    </h3>

                    <div className="flex justify-center gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                className={`w-14 h-14 ${social.color} rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg`}
                            >
                                <social.icon className="text-2xl" />
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ContactInfo;
