import { useState, useEffect } from 'react';
import { FaFacebook, FaLinkedin, FaTwitter, FaUser } from 'react-icons/fa';
import api from '../services/api';

const About = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/members?isActive=true');
            setMembers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching members:', error);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    // Separate executive committee and regular members
    const executiveRoles = ['President', 'Vice President', 'General Secretary', 'Treasurer', 'Executive Member'];
    const executiveMembers = members
        .filter(m => executiveRoles.includes(m.role))
        .sort((a, b) => {
            const roleOrder = { 'President': 1, 'Vice President': 2, 'General Secretary': 3, 'Treasurer': 4, 'Executive Member': 5 };
            if (a.priority !== b.priority) return b.priority - a.priority;
            return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
        });

    const regularMembers = members
        .filter(m => m.role === 'Member')
        .sort((a, b) => b.priority - a.priority);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">
                        About JUST Debate Club
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-white text-opacity-90">
                        Empowering voices, shaping minds, and building future leaders through the art of debate
                    </p>
                </div>
            </section>

            {/* About Us Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                        <h2 className="font-heading font-bold text-3xl text-dark mb-6">Our Story</h2>
                        <div className="space-y-4 text-gray leading-relaxed">
                            <p>
                                JUST Debate Club is the premier debating society of Jashore University of Science and Technology.
                                Founded with a vision to nurture critical thinking and eloquent communication, we have grown into
                                a vibrant community of passionate debaters and public speakers.
                            </p>
                            <p>
                                Our club provides a platform for students to develop their argumentative skills, enhance their
                                public speaking abilities, and engage in meaningful discussions on contemporary issues. Through
                                regular practice sessions, workshops, and competitions, we prepare our members to excel in both
                                national and international debating arenas.
                            </p>
                            <p>
                                We believe that debate is more than just winning arguments—it's about understanding diverse perspectives,
                                building empathy, and developing the confidence to articulate ideas effectively. Our members go on to
                                become leaders in various fields, carrying forward the skills and values they learned through debate.
                            </p>
                        </div>

                        {/* Mission & Vision */}
                        <div className="grid md:grid-cols-2 gap-6 mt-10">
                            <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-xl">
                                <h3 className="font-heading font-bold text-xl mb-3">Our Mission</h3>
                                <p className="text-sm text-white text-opacity-90">
                                    To cultivate critical thinking, effective communication, and leadership skills through
                                    the art of debate, preparing students to become confident and articulate voices in society.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-secondary to-secondary-dark text-white p-6 rounded-xl">
                                <h3 className="font-heading font-bold text-xl mb-3">Our Vision</h3>
                                <p className="text-sm text-white text-opacity-90">
                                    To be the leading debate club that shapes future leaders, fostering a culture of
                                    intellectual discourse and creating a lasting impact on our community and beyond.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Executive Committee */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark mb-4">
                            Executive Committee
                        </h2>
                        <p className="text-gray text-lg max-w-2xl mx-auto">
                            Meet the dedicated leaders who guide our club towards excellence
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : executiveMembers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {executiveMembers.map((member) => (
                                <div
                                    key={member._id}
                                    className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                                >
                                    {/* Member Photo */}
                                    <div className="relative h-72 bg-gradient-to-br from-primary to-secondary overflow-hidden">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaUser className="text-6xl text-white opacity-50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Member Info */}
                                    <div className="p-6 text-center">
                                        <h3 className="font-heading font-bold text-xl text-dark mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-primary font-semibold mb-2">{member.role}</p>
                                        <p className="text-gray text-sm mb-1">{member.department}</p>
                                        <p className="text-gray text-sm mb-4">Batch: {member.batch}</p>

                                        {member.bio && (
                                            <p className="text-gray text-sm mb-4 line-clamp-3">{member.bio}</p>
                                        )}

                                        {/* Social Links */}
                                        {(member.socialLinks?.facebook || member.socialLinks?.linkedin || member.socialLinks?.twitter) && (
                                            <div className="flex justify-center gap-3">
                                                {member.socialLinks.facebook && (
                                                    <a
                                                        href={member.socialLinks.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                                    >
                                                        <FaFacebook />
                                                    </a>
                                                )}
                                                {member.socialLinks.linkedin && (
                                                    <a
                                                        href={member.socialLinks.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                                    >
                                                        <FaLinkedin />
                                                    </a>
                                                )}
                                                {member.socialLinks.twitter && (
                                                    <a
                                                        href={member.socialLinks.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                                    >
                                                        <FaTwitter />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
                            <p className="text-gray">No executive committee members found</p>
                        </div>
                    )}
                </div>
            </section>

            {/* All Members */}
            {regularMembers.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark mb-4">
                                Our Members
                            </h2>
                            <p className="text-gray text-lg max-w-2xl mx-auto">
                                The passionate individuals who make our club thrive
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {regularMembers.map((member) => (
                                <div
                                    key={member._id}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Member Photo */}
                                    <div className="relative aspect-square bg-gradient-to-br from-primary to-secondary overflow-hidden">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaUser className="text-4xl text-white opacity-50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Member Info */}
                                    <div className="p-3 text-center">
                                        <h3 className="font-bold text-sm text-dark mb-1 line-clamp-2">
                                            {member.name}
                                        </h3>
                                        <p className="text-gray text-xs">{member.department}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Join Us CTA */}
            <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
                        Ready to Join Us?
                    </h2>
                    <p className="text-lg mb-8 text-white text-opacity-90 max-w-2xl mx-auto">
                        Become part of our vibrant community and develop skills that will last a lifetime
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                    >
                        Get In Touch
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;
