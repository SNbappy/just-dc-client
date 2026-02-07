import { HiSparkles, HiLightBulb, HiUserGroup, HiTrendingUp, HiAcademicCap } from 'react-icons/hi';
import { FaTrophy, FaHandshake, FaGlobeAsia, FaHeart } from 'react-icons/fa';

const About = () => {
    const values = [
        {
            icon: HiLightBulb,
            title: 'Critical Thinking',
            description: 'We foster analytical minds that question, evaluate, and form well-reasoned arguments.',
        },
        {
            icon: FaHandshake,
            title: 'Respectful Discourse',
            description: 'We believe in the power of civil debate where ideas are challenged, not people.',
        },
        {
            icon: HiTrendingUp,
            title: 'Continuous Growth',
            description: 'Every debate is an opportunity to learn, improve, and develop new perspectives.',
        },
        {
            icon: FaHeart,
            title: 'Inclusive Community',
            description: 'We welcome diverse voices and create a safe space for everyone to express their views.',
        },
    ];

    const milestones = [
        {
            year: '2018',
            title: 'Foundation',
            description: 'JUST Debate Club was established with a vision to create a platform for intellectual discourse.',
        },
        {
            year: '2019',
            title: 'First National Win',
            description: 'Our team secured the championship at the National Debate Championship.',
        },
        {
            year: '2024',
            title: 'International Recognition',
            description: 'Represented Bangladesh at the Asian Debate Championship in Singapore.',
        },
        {
            year: '2026',
            title: 'Legacy Continues',
            description: '250+ active members and 50+ tournament victories, shaping future leaders.',
        },
    ];

    const achievements = [
        { icon: FaTrophy, number: '50+', label: 'Tournament Wins' },
        { icon: HiUserGroup, number: '200+', label: 'Active Members' },
        { icon: HiAcademicCap, number: '100+', label: 'Events Organized' },
        { icon: FaGlobeAsia, number: '15+', label: 'Years of Excellence' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section
                className="relative py-20 bg-fixed bg-cover bg-center"
                style={{ backgroundImage: 'url(/sticky.jpg)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/90"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white font-semibold text-xs uppercase tracking-wider rounded-full mb-6">
                            <HiSparkles />
                            <span>About Us</span>
                        </div>
                        <h1 className="font-heading font-bold text-6xl md:text-7xl text-white mb-6">
                            Where Words<br />Shape Leaders
                        </h1>
                        <p className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed">
                            For over 8 years, JUST Debate Club has been nurturing critical thinkers,
                            confident speakers, and future leaders through the art of debate.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-shadow">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                <HiAcademicCap className="text-4xl text-primary" />
                            </div>
                            <h2 className="font-heading font-bold text-4xl text-dark mb-4">
                                Our Mission
                            </h2>
                            <p className="text-gray text-lg leading-relaxed">
                                To empower students with the skills of critical thinking, effective communication,
                                and respectful discourse. We aim to create a vibrant community where ideas flourish,
                                perspectives broaden, and leaders emerge through the transformative power of debate.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-shadow">
                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                                <FaGlobeAsia className="text-4xl text-accent" />
                            </div>
                            <h2 className="font-heading font-bold text-4xl text-dark mb-4">
                                Our Vision
                            </h2>
                            <p className="text-gray text-lg leading-relaxed">
                                To be the leading debate platform in Bangladesh, recognized for producing articulate,
                                analytical, and socially conscious individuals who contribute meaningfully to society
                                and inspire positive change through informed dialogue.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-accent bg-opacity-10 text-accent font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                            Our Journey
                        </span>
                        <h2 className="font-heading font-bold text-5xl text-dark mb-4">
                            A Legacy of Excellence
                        </h2>
                        <p className="text-gray text-lg max-w-2xl mx-auto">
                            From humble beginnings to becoming one of the most respected debate clubs in the country
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-accent to-primary"></div>

                        {/* Milestones */}
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Content */}
                                    <div className="flex-1 bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="inline-block px-4 py-2 bg-primary text-white font-bold text-lg rounded-xl">
                                                {milestone.year}
                                            </span>
                                            <h3 className="font-heading font-bold text-2xl text-dark">
                                                {milestone.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray text-lg">
                                            {milestone.description}
                                        </p>
                                    </div>

                                    {/* Center Dot */}
                                    <div className="hidden md:block w-6 h-6 bg-accent rounded-full border-4 border-white shadow-lg z-10"></div>

                                    {/* Spacer */}
                                    <div className="hidden md:block flex-1"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gradient-to-br from-primary to-accent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                            What We Stand For
                        </span>
                        <h2 className="font-heading font-bold text-5xl text-white mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-white/90 text-lg max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                            >
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                                    <value.icon className="text-4xl text-white" />
                                </div>
                                <h3 className="font-heading font-bold text-2xl text-white mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-white/90 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            {/* <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-accent bg-opacity-10 text-accent font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                            Our Impact
                        </span>
                        <h2 className="font-heading font-bold text-5xl text-dark mb-4">
                            By The Numbers
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {achievements.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
                                    <stat.icon className="text-3xl text-primary" />
                                </div>
                                <h3 className="font-heading font-bold text-5xl text-dark mb-2">
                                    {stat.number}
                                </h3>
                                <p className="text-gray font-medium text-lg">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-heading font-bold text-5xl text-dark mb-6">
                        Ready to Join Our Community?
                    </h2>
                    <p className="text-gray text-xl mb-10 leading-relaxed">
                        Whether you're an experienced debater or just starting out, there's a place for you at JUST Debate Club.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-10 py-5 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-2xl">
                            Become a Member
                        </button>
                        <button className="px-10 py-5 bg-white text-primary font-bold text-lg rounded-xl border-2 border-primary hover:bg-gray-50 transition-all shadow-lg">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
