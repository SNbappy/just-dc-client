import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import api from '../../services/api';

const EventsSection = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            const allEvents = response.data.data || [];

            // Get upcoming events first, then sort by date
            const upcomingEvents = allEvents
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3); // Get latest 3 upcoming events

            setEvents(upcomingEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
                </div>
            </section>
        );
    }

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
                    <Link
                        to="/events"
                        className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        View All Events
                        <HiArrowRight />
                    </Link>
                </div>

                {/* Events Grid */}
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => {
                            const eventDate = new Date(event.date);
                            const isPast = eventDate < new Date();
                            const id = event.id ?? event._id;

                            return (
                                <Link
                                    to={`/events/${id}`}
                                    key={id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
                                >

                                    {/* Event Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        {event.image ? (
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                                                <FaCalendarAlt className="text-6xl text-white opacity-50" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                                            {isPast ? 'Completed' : 'Upcoming'}
                                        </div>

                                        {/* Category Tag */}
                                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white bg-opacity-90 backdrop-blur-sm text-dark text-xs font-semibold rounded-lg capitalize">
                                            {event.category}
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-6">
                                        <h3 className="font-heading font-bold text-xl text-dark mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>

                                        {/* Info Grid */}
                                        <div className="space-y-3 mb-5">
                                            <div className="flex items-center gap-3 text-gray text-sm">
                                                <FaCalendarAlt className="text-primary flex-shrink-0" />
                                                <span>
                                                    {eventDate.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
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
                                            <div className="flex items-center gap-3 text-gray text-sm">
                                                <FaUsers className="text-primary flex-shrink-0" />
                                                <span>
                                                    {event.maxParticipants
                                                        ? `Max ${event.maxParticipants} participants`
                                                        : 'All Members'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Register Button */}
                                        <button className="w-full py-3 bg-primary bg-opacity-10 text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all">
                                            Register Now
                                        </button>
                                    </div>

                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="font-heading font-bold text-2xl text-dark mb-2">
                            No upcoming events
                        </h3>
                        <p className="text-gray">
                            Check back soon for new events!
                        </p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default EventsSection;
