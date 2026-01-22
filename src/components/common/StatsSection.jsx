import { FaTrophy, FaUsers, FaCalendarCheck, FaAward } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const StatsSection = () => {
    const stats = [
        {
            icon: FaTrophy,
            number: '50+',
            label: 'Tournaments Won',
            color: 'primary',
            bgColor: 'bg-primary',
        },
        {
            icon: FaUsers,
            number: '200+',
            label: 'Active Members',
            color: 'secondary',
            bgColor: 'bg-secondary',
        },
        {
            icon: FaCalendarCheck,
            number: '100+',
            label: 'Events Organized',
            color: 'accent',
            bgColor: 'bg-accent',
        },
        {
            icon: FaAward,
            number: '15+',
            label: 'Years of Excellence',
            color: 'primary',
            bgColor: 'bg-primary',
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-secondary relative overflow-hidden">

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white bg-opacity-20 backdrop-blur-sm text-white font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                        <HiSparkles />
                        <span>Our Achievements</span>
                    </div>
                    <h2 className="font-heading font-bold text-5xl text-white mb-4">
                        Making History Since 2008
                    </h2>
                    <p className="text-white text-opacity-90 text-lg max-w-2xl mx-auto">
                        A legacy of excellence, passion, and countless achievements that define our journey
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105">

                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl group-hover:scale-110 transition-transform">
                                        <stat.icon className="text-white text-3xl" />
                                    </div>
                                </div>

                                {/* Number */}
                                <div className="mb-2">
                                    <h3 className="font-heading font-bold text-5xl text-white">
                                        {stat.number}
                                    </h3>
                                </div>

                                {/* Label */}
                                <p className="text-white text-opacity-90 font-medium text-lg">
                                    {stat.label}
                                </p>

                                {/* Decorative Line */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <p className="text-white text-opacity-90 text-lg mb-6">
                        Want to be part of our success story?
                    </p>
                    <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl">
                        Join JUST Debate Club
                    </button>
                </div>

            </div>
        </section>
    );
};

export default StatsSection;
