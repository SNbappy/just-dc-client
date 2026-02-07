import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers, FaArrowRight } from "react-icons/fa";
import { HiSparkles, HiFilter } from "react-icons/hi";
import api from "../services/api";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get("/events");
            setEvents(response.data.data || []);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filter === "upcoming") return eventDate >= today;
        if (filter === "past") return eventDate < today;
        return true;
    });

    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (filter === "upcoming") return dateA - dateB;
        return dateB - dateA;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-gray font-semibold">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative py-24 bg-fixed bg-cover bg-center"
                style={{ backgroundImage: 'url(/sticky.jpg)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-accent/95"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white font-semibold text-xs uppercase tracking-wider rounded-full mb-6">
                            <HiSparkles />
                            <span>Events & Activities</span>
                        </div>
                        <h1 className="font-heading font-bold text-5xl md:text-6xl text-white mb-6">
                            Join Our Events
                        </h1>
                        <p className="text-white/90 text-xl max-w-3xl mx-auto">
                            Experience world-class debates, workshops, and competitions that shape future leaders
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <HiFilter className="text-2xl text-gray-400" />
                            <span className="font-semibold text-dark">Filter Events:</span>
                        </div>

                        <div className="flex gap-3">
                            {[
                                { key: "all", label: "All Events", count: events.length },
                                {
                                    key: "upcoming",
                                    label: "Upcoming",
                                    count: events.filter(e => new Date(e.date) >= new Date()).length
                                },
                                {
                                    key: "past",
                                    label: "Past Events",
                                    count: events.filter(e => new Date(e.date) < new Date()).length
                                },
                            ].map((btn) => (
                                <button
                                    key={btn.key}
                                    onClick={() => setFilter(btn.key)}
                                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${filter === btn.key
                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {btn.label}
                                    <span className="ml-2 text-sm opacity-75">({btn.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {sortedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedEvents.map((event) => {
                                const eventDate = new Date(event.date);
                                const isPast = eventDate < new Date();
                                const id = event.id ?? event._id;

                                return (
                                    <Link
                                        to={`/events/${id}`}
                                        key={id}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden">
                                            {event.image ? (
                                                <>
                                                    <img
                                                        src={event.image}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                                    <FaCalendar className="text-6xl text-white/30" />
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${isPast
                                                            ? "bg-gray-900/80 text-white"
                                                            : "bg-green-500/90 text-white"
                                                        }`}
                                                >
                                                    {isPast ? "Completed" : "Upcoming"}
                                                </span>
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-4 py-1.5 bg-white/95 backdrop-blur-sm text-primary rounded-full text-xs font-bold capitalize shadow-lg">
                                                    {event.category}
                                                </span>
                                            </div>

                                            {/* Date Overlay */}
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                                                    <div className="text-primary font-bold text-2xl leading-none">
                                                        {eventDate.getDate()}
                                                    </div>
                                                    <div className="text-gray-600 text-xs font-semibold uppercase">
                                                        {eventDate.toLocaleDateString("en-US", { month: "short" })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="font-heading font-bold text-xl text-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>

                                            <p className="text-gray text-sm mb-5 line-clamp-2 leading-relaxed">
                                                {event.description}
                                            </p>

                                            <div className="space-y-3 mb-5">
                                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FaClock className="text-primary text-xs" />
                                                    </div>
                                                    <span className="font-medium">{event.time}</span>
                                                </div>

                                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FaMapMarkerAlt className="text-accent text-xs" />
                                                    </div>
                                                    <span className="line-clamp-1 font-medium">{event.location}</span>
                                                </div>

                                                {event.maxParticipants && (
                                                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FaUsers className="text-green-600 text-xs" />
                                                        </div>
                                                        <span className="font-medium">Max {event.maxParticipants} participants</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CTA */}
                                            <div className={`flex items-center justify-between pt-4 border-t ${isPast ? 'border-gray-200' : 'border-gray-200'
                                                }`}>
                                                {!isPast ? (
                                                    <>
                                                        <span className="text-primary font-bold text-sm">Register Now</span>
                                                        <FaArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-gray-600 font-bold text-sm">View Details</span>
                                                        <FaArrowRight className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                                <FaCalendar className="text-5xl text-gray-300" />
                            </div>
                            <h3 className="font-heading font-bold text-3xl text-dark mb-3">
                                No {filter !== "all" && filter} events found
                            </h3>
                            <p className="text-gray text-lg mb-8">
                                {filter === "upcoming"
                                    ? "Check back soon for exciting new events!"
                                    : filter === "past"
                                        ? "No past events to display yet."
                                        : "No events available at the moment."}
                            </p>
                            {filter !== "all" && (
                                <button
                                    onClick={() => setFilter("all")}
                                    className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg"
                                >
                                    View All Events
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Events;
