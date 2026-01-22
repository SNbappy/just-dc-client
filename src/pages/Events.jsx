import { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import api from '../services/api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            setEvents(response.data.data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter events
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filter === 'upcoming') {
            return eventDate >= today;
        } else if (filter === 'past') {
            return eventDate < today;
        }
        return true;
    });

    // Sort by date (upcoming first, then past)
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // If filtering upcoming, show nearest first
        if (filter === 'upcoming') {
            return dateA - dateB;
        }
        // If filtering past or all, show most recent first
        return dateB - dateA;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-heading font-bold text-4xl md:text-5xl text-dark mb-4">
                        Club Events
                    </h1>
                    <p className="text-gray text-lg max-w-2xl mx-auto">
                        Join us in our exciting debates, workshops, and competitions
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex justify-center gap-4 mb-12">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'all'
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        All Events
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'upcoming'
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'past'
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Past Events
                    </button>
                </div>

                {/* Events Grid */}
                {sortedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedEvents.map((event) => {
                            const eventDate = new Date(event.date);
                            const isPast = eventDate < new Date();

                            return (
                                <div
                                    key={event._id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                >
                                    {/* Event Image */}
                                    <div className="relative h-56 bg-gradient-to-br from-primary to-secondary overflow-hidden">
                                        {event.image ? (
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaCalendar className="text-6xl text-white opacity-50" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isPast
                                                    ? 'bg-gray-800 text-white'
                                                    : 'bg-green-500 text-white'
                                                }`}>
                                                {isPast ? 'Completed' : 'Upcoming'}
                                            </span>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white text-primary rounded-full text-sm font-semibold capitalize">
                                                {event.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Event Content */}
                                    <div className="p-6">
                                        <h3 className="font-heading font-bold text-xl text-dark mb-3 line-clamp-2">
                                            {event.title}
                                        </h3>

                                        <p className="text-gray text-sm mb-4 line-clamp-3">
                                            {event.description}
                                        </p>

                                        {/* Event Details */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray text-sm">
                                                <FaCalendar className="text-primary flex-shrink-0" />
                                                <span>
                                                    {eventDate.toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray text-sm">
                                                <FaClock className="text-primary flex-shrink-0" />
                                                <span>{event.time}</span>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray text-sm">
                                                <FaMapMarkerAlt className="text-primary flex-shrink-0" />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>

                                            {event.maxParticipants && (
                                                <div className="flex items-center gap-3 text-gray text-sm">
                                                    <FaUsers className="text-primary flex-shrink-0" />
                                                    <span>Max {event.maxParticipants} participants</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        {!isPast && (
                                            <button className="w-full mt-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                                                Register Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-20">
                        <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="font-heading font-bold text-2xl text-dark mb-2">
                            No {filter !== 'all' && filter} events found
                        </h3>
                        <p className="text-gray">
                            {filter === 'upcoming'
                                ? 'Check back soon for new events!'
                                : filter === 'past'
                                    ? 'No past events to display yet.'
                                    : 'No events available at the moment.'}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Events;
