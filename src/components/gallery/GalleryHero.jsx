const GalleryHero = () => {
    return (
        <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary py-24 lg:py-32 overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Content */}
                <div className="text-center text-white">
                    <div className="inline-block mb-6">
                        <span className="px-4 py-1.5 bg-white bg-opacity-20 backdrop-blur-sm font-semibold text-xs uppercase tracking-wider rounded-full">
                            Gallery
                        </span>
                    </div>

                    <h1 className="font-heading font-bold text-5xl lg:text-6xl mb-6">
                        Moments Worth Remembering
                    </h1>

                    <p className="text-xl lg:text-2xl text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed">
                        Explore our collection of memorable moments, victories, and experiences
                        that define the spirit of JUST Debate Club.
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">500+</div>
                            <div className="text-white text-opacity-80 text-sm">Photos</div>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">50+</div>
                            <div className="text-white text-opacity-80 text-sm">Events Covered</div>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">15+</div>
                            <div className="text-white text-opacity-80 text-sm">Years Archive</div>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">100+</div>
                            <div className="text-white text-opacity-80 text-sm">Achievements</div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default GalleryHero;
