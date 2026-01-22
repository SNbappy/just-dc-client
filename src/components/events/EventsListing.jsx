import { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaFilter } from 'react-icons/fa';

const EventsListing = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeCategory, setActiveCategory] = useState('all');

    const events = [
        {
            id: 1,
            title: 'Inter-University Debate Championship 2026',
            date: 'Feb 15, 2026',
            time: '10:00 AM',
            location: 'JUST Auditorium',
            participants: '12 Teams',
            category: 'Tournament',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
            description: 'Annual inter-university debate championship featuring top debaters from across Bangladesh.',
            registrationOpen: true,
        },
        {
            id: 2,
            title: 'Public Speaking Masterclass',
            date: 'Feb 08, 2026',
            time: '3:00 PM',
            location: 'Room 301, Academic Building',
            participants: '50 Seats',
            category: 'Workshop',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=600&h=400&fit=crop',
            description: 'Learn the art of captivating public speaking from industry experts.',
            registrationOpen: true,
        },
        {
            id: 3,
            title: 'Weekly Practice Session',
            date: 'Jan 28, 2026',
            time: '5:00 PM',
            location: 'Debate Club Room',
            participants: 'All Members',
            category: 'Practice',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
            description: 'Regular practice session for all members to hone their debate skills.',
            registrationOpen: false,
        },
        {
            id: 4,
            title: 'National Debate Festival 2025',
            date: 'Dec 20, 2025',
            time: '9:00 AM',
            location: 'JUST Campus',
            participants: '20 Teams',
            category: 'Tournament',
            status: 'past',
            image: 'https://images.unsplash.com/photo-1540317580384-e5d43616d00b?w=600&h=400&fit=crop',
            description: 'Three-day national debate festival with participants from 15+ universities.',
            registrationOpen: false,
        },
        {
            id: 5,
            title: 'Critical Thinking Workshop',
            date: 'Dec 10, 2025',
            time: '2:00 PM',
            location: 'Seminar Hall',
            participants: '60 Attendees',
            category: 'Workshop',
            status: 'past',
            image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=400&fit=crop',
            description: 'Intensive workshop on developing critical thinking and analytical skills.',
            registrationOpen: false,
        },
        {
            id: 6,
            title: 'Freshers\' Debate Competition',
            date: 'Nov 25, 2025',
            time: '4:00 PM',
            location: 'JUST Auditorium',
            participants: '15 Teams',
            category: 'Tournament',
            status: 'past',
            image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
            description: 'Special debate competition exclusively for first-year students.',
            registrationOpen: false,
        },
    ];

    const categories = ['all', 'Tournament', 'Workshop', 'Practice'];

    const filteredEvents = events.filter(event => {
        const statusMatch = activeFilter === 'all' || event.status === activeFilter;
        const categoryMatch = activeCategory === 'all' || event.category === activeCategory;
        return statusMatch && categoryMatch;
    });

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Filters Section */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        {/* Status Filter */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <FaFilter className="text-primary" />
                                <span className="font-semibold text-dark">Filter by Status:</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${activeFilter === 'all'
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-white text-gray border border-gray-200 hover:border-primary'
                                        }`}
                                >
                                    All Events
                                </button>
                                <button
                                    onClick={() => setActiveFilter('upcoming')}
                                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${activeFilter === 'upcoming'
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-white text-gray border border-gray-200 hover:border-primary'
                                        }`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() => setActiveFilter('past')}
                                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${activeFilter === 'past'
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-white text-gray border border-gray-200 hover:border-primary'
                                        }`}
                                >
                                    Past Events
                                </button>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-semibold text-dark">Category:</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ${activeCategory === category
                                                ? 'bg-secondary text-white shadow-lg'
                                                : 'bg-white text-gray border border-gray-200 hover:border-secondary'
                                            }`}
                                    >
                                        {category === 'all' ? 'All Categories' : category}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-8">
                    <p className="text-gray text-lg">
                        Showing <span className="font-bold text-dark">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Events Grid */}
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => (
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
                                    <div className={`absolute top-4 right-4 px-3 py-1 ${event.status === 'upcoming' ? 'bg-green-500' : 'bg-gray-500'
                                        } text-white text-xs font-semibold rounded-full`}>
                                        {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                                    </div>
                                    {/* Category Tag */}
                                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-white bg-opacity-90 backdrop-blur-sm text-dark text-xs font-semibold rounded-lg">
                                        {event.category}
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="p-6">
                                    <h3 className="font-heading font-bold text-xl text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {event.title}
                                    </h3>

                                    <p className="text-gray text-sm mb-4 line-clamp-2">
                                        {event.description}
                                    </p>

                                    {/* Info Grid */}
                                    <div className="space-y-2.5 mb-5">
                                        <div className="flex items-center gap-3 text-gray text-sm">
                                            <FaCalendarAlt className="text-primary flex-shrink-0" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray text-sm">
                                            <FaClock className="text-primary flex-shrink-0" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray text-sm">
                                            <FaMapMarkerAlt className="text-primary flex-shrink-0" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray text-sm">
                                            <FaUsers className="text-primary flex-shrink-0" />
                                            <span>{event.participants}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {event.status === 'upcoming' && event.registrationOpen ? (
                                        <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all">
                                            Register Now
                                        </button>
                                    ) : event.status === 'upcoming' ? (
                                        <button className="w-full py-3 bg-gray-300 text-gray-600 font-semibold rounded-xl cursor-not-allowed">
                                            View Details
                                        </button>
                                    ) : (
                                        <button className="w-full py-3 bg-secondary bg-opacity-10 text-secondary font-semibold rounded-xl hover:bg-secondary hover:text-white transition-all">
                                            View Highlights
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="font-heading font-bold text-2xl text-dark mb-2">No Events Found</h3>
                        <p className="text-gray">Try adjusting your filters to see more events</p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default EventsListing;
