import { FaBullseye, FaEye, FaHeart } from 'react-icons/fa';

const MissionVision = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-secondary bg-opacity-10 text-secondary font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                        Our Purpose
                    </span>
                    <h2 className="font-heading font-bold text-5xl text-dark mb-4">
                        Mission, Vision & Values
                    </h2>
                    <p className="text-gray text-lg max-w-2xl mx-auto">
                        The guiding principles that drive our community forward
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Mission Card */}
                    <div className="group relative bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-10 text-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaBullseye className="text-4xl" />
                            </div>

                            <h3 className="font-heading font-bold text-3xl mb-4">Our Mission</h3>

                            <p className="text-white text-opacity-90 leading-relaxed">
                                To empower students with critical thinking, effective communication, and leadership skills
                                through structured debates, fostering a culture of intellectual growth and civic engagement.
                            </p>
                        </div>
                    </div>

                    {/* Vision Card */}
                    <div className="group relative bg-gradient-to-br from-secondary to-secondary-dark rounded-3xl p-10 text-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaEye className="text-4xl" />
                            </div>

                            <h3 className="font-heading font-bold text-3xl mb-4">Our Vision</h3>

                            <p className="text-white text-opacity-90 leading-relaxed">
                                To be the premier debate platform in Bangladesh, producing confident speakers and thoughtful
                                leaders who contribute meaningfully to society through reasoned discourse and informed decision-making.
                            </p>
                        </div>
                    </div>

                    {/* Values Card */}
                    <div className="group relative bg-gradient-to-br from-accent to-accent-dark rounded-3xl p-10 text-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaHeart className="text-4xl" />
                            </div>

                            <h3 className="font-heading font-bold text-3xl mb-4">Our Values</h3>

                            <ul className="text-white text-opacity-90 space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">•</span>
                                    <span>Excellence in argumentation and public speaking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">•</span>
                                    <span>Respect for diverse perspectives</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">•</span>
                                    <span>Integrity and ethical discourse</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">•</span>
                                    <span>Collaboration and teamwork</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default MissionVision;
