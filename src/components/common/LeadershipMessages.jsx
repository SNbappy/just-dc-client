import { FaQuoteLeft } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const LeadershipMessages = () => {
    const leaders = [
        {
            name: 'John Doe',
            title: 'President',
            session: '2023-2024',
            message: 'Welcome to JUST Debate Club! As president, I am honored to lead a community passionate about critical thinking and eloquent expression. Our club is more than debates—it\'s a family where ideas flourish and friendships are forged.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            color: 'primary',
        },
        {
            name: 'Jane Smith',
            title: 'General Secretary',
            session: '2023-2024',
            message: 'Together, we create an inclusive environment where every voice matters. From organizing tournaments to mentoring new members, we ensure everyone has the opportunity to grow and excel in the art of debate.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            color: 'secondary',
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <span className="inline-block px-4 py-1.5 bg-primary bg-opacity-10 text-primary font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                            Leadership
                        </span>
                    </div>
                    <h2 className="font-heading font-bold text-5xl text-dark mb-4">
                        Words from Our Leaders
                    </h2>
                    <p className="text-gray text-lg max-w-2xl mx-auto">
                        Meet the passionate individuals steering our debate community toward excellence
                    </p>
                </div>

                {/* Leadership Cards - Modern Design */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {leaders.map((leader, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100"
                        >

                            {/* Card Content */}
                            <div className="p-8 lg:p-10">

                                {/* Leader Profile */}
                                <div className="flex items-start gap-5 mb-6">
                                    {/* Profile Image with Ring */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`absolute inset-0 bg-${leader.color} rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                                        <img
                                            src={leader.image}
                                            alt={leader.name}
                                            className="relative w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                                        />
                                        {/* Status Badge */}
                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-${leader.color} rounded-full border-4 border-white`}></div>
                                    </div>

                                    {/* Leader Info */}
                                    <div className="flex-1 pt-1">
                                        <h3 className="font-heading font-bold text-2xl text-dark mb-1">
                                            {leader.name}
                                        </h3>
                                        <p className={`text-${leader.color} font-semibold text-sm mb-1`}>
                                            {leader.title}
                                        </p>
                                        <p className="text-gray text-xs">
                                            Session {leader.session}
                                        </p>
                                    </div>
                                </div>

                                {/* Quote Icon */}
                                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${leader.color} bg-opacity-10 rounded-xl mb-4`}>
                                    <FaQuoteLeft className={`text-${leader.color}`} size={20} />
                                </div>

                                {/* Message */}
                                <blockquote className="mb-6">
                                    <p className="text-gray-600 leading-relaxed text-base">
                                        {leader.message}
                                    </p>
                                </blockquote>

                                {/* Read More Link */}
                                <div className={`inline-flex items-center gap-2 text-${leader.color} font-semibold text-sm group-hover:gap-3 transition-all cursor-pointer`}>
                                    <span>Read Full Message</span>
                                    <HiArrowRight className="text-lg" />
                                </div>

                            </div>

                            {/* Decorative Bottom Bar */}
                            <div className={`h-1.5 bg-gradient-to-r from-${leader.color} to-${leader.color}-dark`}></div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default LeadershipMessages;
