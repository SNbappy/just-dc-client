const AboutHero = () => {
    return (
        <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary py-24 lg:py-32 overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Content */}
                <div className="text-center text-white">
                    <div className="inline-block mb-6">
                        <span className="px-4 py-1.5 bg-white bg-opacity-20 backdrop-blur-sm font-semibold text-xs uppercase tracking-wider rounded-full">
                            About Us
                        </span>
                    </div>

                    <h1 className="font-heading font-bold text-5xl lg:text-6xl mb-6">
                        Where Voices Shape the Future
                    </h1>

                    <p className="text-xl lg:text-2xl text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed">
                        Since 2008, JUST Debate Club has been nurturing critical thinkers, eloquent speakers,
                        and future leaders through the transformative power of debate.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold mb-2">15+</div>
                            <div className="text-white text-opacity-80">Years Legacy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold mb-2">200+</div>
                            <div className="text-white text-opacity-80">Active Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
                            <div className="text-white text-opacity-80">Championships</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold mb-2">100+</div>
                            <div className="text-white text-opacity-80">Events Hosted</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutHero;
