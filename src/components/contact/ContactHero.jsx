const ContactHero = () => {
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
                            Get In Touch
                        </span>
                    </div>

                    <h1 className="font-heading font-bold text-5xl lg:text-6xl mb-6">
                        Contact Us
                    </h1>

                    <p className="text-xl lg:text-2xl text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed">
                        Have questions? Want to join us? We'd love to hear from you.
                        Reach out and let's start a conversation.
                    </p>

                </div>

            </div>
        </section>
    );
};

export default ContactHero;
