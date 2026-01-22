import Button from './Button';
import { HiArrowRight } from 'react-icons/hi';

const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary min-h-[600px] flex items-center">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 bg-black opacity-10"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="text-white space-y-6">
                        <h1 className="font-heading font-bold text-5xl md:text-6xl leading-tight">
                            Empower Your Voice Through <span className="text-yellow-300">Debate</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                            Join JUST Debate Club and develop critical thinking, public speaking, and leadership skills. Shape your future through the art of persuasive argumentation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button to="/register" variant="secondary" className="text-lg">
                                Join Us Today <HiArrowRight className="inline ml-2" />
                            </Button>
                            <Button to="/events" variant="outline" className="text-lg bg-white bg-opacity-10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary">
                                Upcoming Events
                            </Button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div>
                                <h3 className="font-heading font-bold text-3xl md:text-4xl text-yellow-300">150+</h3>
                                <p className="text-gray-200 text-sm">Active Members</p>
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-3xl md:text-4xl text-yellow-300">50+</h3>
                                <p className="text-gray-200 text-sm">Events Hosted</p>
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-3xl md:text-4xl text-yellow-300">20+</h3>
                                <p className="text-gray-200 text-sm">Awards Won</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Image/Illustration Placeholder */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            {/* Decorative circles */}
                            <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>

                            {/* Placeholder for image - using gradient box for now */}
                            <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
                                <div className="aspect-square bg-gradient-to-br from-yellow-300 to-primary-light rounded-xl flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <div className="text-6xl mb-4">🎤</div>
                                        <p className="font-heading font-semibold text-xl">Shape Your Future</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Wave Decoration */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F3F4F6" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
