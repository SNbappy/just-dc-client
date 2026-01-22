import { FaHistory, FaTrophy, FaUsers, FaGlobe } from 'react-icons/fa';

const OurHistory = () => {
    const milestones = [
        {
            year: '2008',
            title: 'The Beginning',
            description: 'JUST Debate Club was founded by passionate students who believed in the power of debate to transform minds and build leaders.',
            icon: FaHistory,
        },
        {
            year: '2012',
            title: 'First National Victory',
            description: 'Won our first national inter-university debate championship, putting JUST on the debate map of Bangladesh.',
            icon: FaTrophy,
        },
        {
            year: '2016',
            title: 'Community Expansion',
            description: 'Reached 100+ active members and established structured training programs for newcomers and advanced debaters.',
            icon: FaUsers,
        },
        {
            year: '2020',
            title: 'International Recognition',
            description: 'Represented Bangladesh in international debate competitions and established partnerships with global debate organizations.',
            icon: FaGlobe,
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary bg-opacity-10 text-primary font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                        Our Journey
                    </span>
                    <h2 className="font-heading font-bold text-5xl text-dark mb-4">
                        A Legacy of Excellence
                    </h2>
                    <p className="text-gray text-lg max-w-2xl mx-auto">
                        From humble beginnings to becoming a powerhouse of debate in Bangladesh
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">

                    {/* Vertical Line (hidden on mobile) */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent"></div>

                    {/* Milestones */}
                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className={`relative flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    }`}
                            >

                                {/* Content Card */}
                                <div className="w-full lg:w-5/12">
                                    <div className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                                        }`}>

                                        {/* Year Badge */}
                                        <div className={`inline-block mb-4 ${index % 2 === 0 ? 'lg:float-right lg:ml-4' : 'lg:float-left lg:mr-4'}`}>
                                            <span className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl text-lg">
                                                {milestone.year}
                                            </span>
                                        </div>

                                        <h3 className="font-heading font-bold text-2xl text-dark mb-3 clear-both">
                                            {milestone.title}
                                        </h3>

                                        <p className="text-gray leading-relaxed">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Icon */}
                                <div className="relative z-10 flex-shrink-0">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg ring-8 ring-white">
                                        <milestone.icon className="text-white text-3xl" />
                                    </div>
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="hidden lg:block w-5/12"></div>

                            </div>
                        ))}
                    </div>

                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16 pt-16 border-t border-gray-200">
                    <h3 className="font-heading font-bold text-3xl text-dark mb-4">
                        Be Part of Our Next Chapter
                    </h3>
                    <p className="text-gray mb-8 max-w-2xl mx-auto">
                        Join us in writing the next pages of JUST Debate Club's incredible story
                    </p>
                    <button className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg">
                        Join the Club
                    </button>
                </div>

            </div>
        </section>
    );
};

export default OurHistory;
