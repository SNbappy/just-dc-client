const MembersHero = () => {
    return (
        <section className="relative bg-gradient-to-br from-secondary via-secondary-dark to-primary py-24 lg:py-32 overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Content */}
                <div className="text-center text-white">
                    <div className="inline-block mb-6">
                        <span className="px-4 py-1.5 bg-white bg-opacity-20 backdrop-blur-sm font-semibold text-xs uppercase tracking-wider rounded-full">
                            Our Community
                        </span>
                    </div>

                    <h1 className="font-heading font-bold text-5xl lg:text-6xl mb-6">
                        Meet Our Debaters
                    </h1>

                    <p className="text-xl lg:text-2xl text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed">
                        A diverse community of passionate speakers, critical thinkers, and future leaders
                        united by the art of debate.
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">200+</div>
                            <div className="text-white text-opacity-80 text-sm">Total Members</div>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">15</div>
                            <div className="text-white text-opacity-80 text-sm">Batches</div>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">8</div>
                            <div className="text-white text-opacity-80 text-sm">Departments</div>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">50+</div>
                            <div className="text-white text-opacity-80 text-sm">Champions</div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default MembersHero;
