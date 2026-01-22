import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const EventsSection = () => {
    const events = [
        {
            id: 1,
            title: 'Inter-University Debate Championship',
            date: 'Feb 15, 2026',
            time: '10:00 AM',
            location: 'JUST Auditorium',
            participants: '12 Teams',
            category: 'Tournament',
            status: 'Upcoming',
            color: 'primary',
            image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
        },
        {
            id: 2,
            title: 'Public Speaking Workshop',
            date: 'Feb 08, 2026',
            time: '3:00 PM',
            location: 'Room 301, Academic Building',
            participants: '50 Seats',
            category: 'Workshop',
            status: 'Registration Open',
            color: 'secondary',
            image: 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=600&h=400&fit=crop',
        },
        {
            id: 3,
            title: 'Weekly Practice Session',
            date: 'Jan 28, 2026',
            time: '5:00 PM',
            location: 'Debate Club Room',
            participants: 'All Members',
            category: 'Practice',
            status: 'Open',
            color: 'accent',
            image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-secondary bg-opacity-10 text-secondary font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                            Events & Activities
                        </span>
                        <h2 className="font-heading font-bold text-5xl text-dark mb-3">
                            Upcoming Events
                        </h2>
                        <p className="text-gray text-lg max-w-2xl">
                            Join us in our exciting debates, workshops, and competitions
                        </p>
                    </div>
                    <button className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                        View All Events
                        <HiArrowRight />
                    </button>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
                        >

                            {/* Event Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Status Badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1 bg-${event.color} text-white text-xs font-semibold rounded-full`}>
                                    {event.status}
                                </div>
                                {/* Category Tag */}
                                <div className="absolute bottom-4 left-4 px-3 py-1 bg-white bg-opacity-90 backdrop-blur-sm text-dark text-xs font-semibold rounded-lg">
                                    {event.category}
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="p-6">
                                <h3 className="font-heading font-bold text-xl text-dark mb-4 group-hover:text-primary transition-colors">
                                    {event.title}
                                </h3>

                                {/* Info Grid */}
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center gap-3 text-gray text-sm">
                                        <FaCalendarAlt className={`text-${event.color} flex-shrink-0`} />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray text-sm">
                                        <FaClock className={`text-${event.color} flex-shrink-0`} />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray text-sm">
                                        <FaMapMarkerAlt className={`text-${event.color} flex-shrink-0`} />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray text-sm">
                                        <FaUsers className={`text-${event.color} flex-shrink-0`} />
                                        <span>{event.participants}</span>
                                    </div>
                                </div>

                                {/* Register Button */}
                                <button className={`w-full py-3 bg-${event.color} bg-opacity-10 text-${event.color} font-semibold rounded-xl hover:bg-${event.color} hover:text-white transition-all`}>
                                    Register Now
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default EventsSection;