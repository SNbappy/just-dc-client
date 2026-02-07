// src/pages/EventDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import {
    FaCalendar,
    FaClock,
    FaMapMarkerAlt,
    FaUsers,
    FaUserTie,
    FaHandsHelping,
    FaGavel,
    FaListUl,
    FaMicrophone,
    FaUser,
    FaTicketAlt,
    FaMoneyBillWave,
    FaUserFriends,
    FaCheckCircle,
} from "react-icons/fa";

const roleLabel = (role) => {
    const map = {
        organizer: "Organizer",
        volunteer: "Volunteer",
        core_adjudicator: "Core Adjudicator",
        tab_team: "Tab Team",
        speaker: "Speaker",
        guest: "Guest",
    };
    return map[role] || role;
};

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/events/${id}`);
                let eventData = res.data?.data || null;

                // ✅ FIX: Parse categories if it's a JSON string
                if (eventData && typeof eventData.categories === 'string') {
                    try {
                        eventData.categories = JSON.parse(eventData.categories);
                    } catch (e) {
                        console.error('Failed to parse categories:', e);
                        eventData.categories = [];
                    }
                }

                // ✅ Ensure categories is always an array
                if (!Array.isArray(eventData?.categories)) {
                    eventData.categories = [];
                }

                console.log('✅ Parsed Categories:', eventData.categories);
                setEvent(eventData);
            } catch (e) {
                toast.error("Failed to load event");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const grouped = useMemo(() => {
        const list = event?.participantsPopulated || event?.participants || [];
        const groups = {};
        for (const p of list) {
            const r = p?.role || "volunteer";
            if (!groups[r]) groups[r] = [];
            groups[r].push(p);
        }
        return groups;
    }, [event]);

    const IconForRole = (role) => {
        if (role === "organizer") return FaUserTie;
        if (role === "volunteer") return FaHandsHelping;
        if (role === "core_adjudicator") return FaGavel;
        if (role === "tab_team") return FaListUl;
        if (role === "speaker") return FaMicrophone;
        if (role === "guest") return FaUser;
        return FaUsers;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold text-dark mb-2">Event not found</h2>
                    <Link to="/events" className="btn-primary inline-block mt-4">
                        Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    const eventDate = new Date(event.date);
    const canRegister = Boolean(event.registrationOpen);
    const categories = event.categories || [];

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="h-64 bg-gradient-to-br from-primary to-secondary relative">
                        {event.image ? (
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        ) : null}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                    {event.category}
                                </span>

                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${canRegister ? "bg-success/80" : "bg-error/80"
                                        }`}
                                >
                                    {canRegister ? "Registration Open" : "Registration Closed"}
                                </span>
                            </div>

                            <h1 className="font-heading text-3xl md:text-4xl font-bold mt-3">{event.title}</h1>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <p className="text-gray leading-relaxed text-lg mb-6">{event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <FaCalendar className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-gray">Date</p>
                                    <p className="font-semibold text-dark">
                                        {eventDate.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <FaClock className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-gray">Time</p>
                                    <p className="font-semibold text-dark">{event.time}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <FaMapMarkerAlt className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-gray">Location</p>
                                    <p className="font-semibold text-dark">{event.location}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <FaUsers className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-gray">Max Participants</p>
                                    <p className="font-semibold text-dark">{event.maxParticipants || "Unlimited"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Registration Categories Section */}
                {canRegister && categories.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-md p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FaTicketAlt className="text-primary text-2xl" />
                            <div>
                                <h2 className="font-heading text-2xl font-bold text-dark">Registration Options</h2>
                                <p className="text-sm text-gray">Choose your registration category</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat, idx) => (
                                <div
                                    key={idx}
                                    className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                                    onClick={() => navigate(`/events/${event.id}/register?category=${encodeURIComponent(cat.name)}`)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-bold text-lg text-dark group-hover:text-primary transition-colors">
                                            {cat.name}
                                        </h3>
                                        {cat.type === "team" ? (
                                            <FaUserFriends className="text-purple-500 text-xl" />
                                        ) : (
                                            <FaUser className="text-blue-500 text-xl" />
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaMoneyBillWave className="text-green-500" />
                                            <span className="font-semibold text-dark">
                                                {cat.price === 0 ? "Free" : `${cat.price}৳`}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <FaUsers className="text-blue-500" />
                                            <span className="text-sm text-gray">
                                                {cat.capacity ? `${cat.capacity} slots` : "Unlimited"}
                                            </span>
                                        </div>

                                        {cat.type === "team" && (
                                            <div className="flex items-center gap-2">
                                                <FaUserFriends className="text-purple-500" />
                                                <span className="text-sm text-gray">
                                                    Team: {cat.teamMin}-{cat.teamMax} members
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <FaCheckCircle className="text-success" />
                                            <span className="text-xs text-gray">
                                                {cat.accessType === "members_only"
                                                    ? "Members Only"
                                                    : cat.accessType === "registered_only"
                                                        ? "Registered Users"
                                                        : "Open to All"}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold group-hover:shadow-md transition-all">
                                        Select →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Event Team Section */}
                {Object.keys(grouped).length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-md p-6 md:p-8">
                        <h2 className="font-heading text-2xl font-bold text-dark mb-6 flex items-center gap-3">
                            <FaUsers className="text-primary" />
                            Event Team
                        </h2>

                        <div className="space-y-8">
                            {Object.entries(grouped).map(([role, list]) => {
                                const RoleIcon = IconForRole(role);
                                return (
                                    <div key={role}>
                                        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-100">
                                            <RoleIcon className="text-primary text-xl" />
                                            <h3 className="font-bold text-lg text-dark">{roleLabel(role)}</h3>
                                            <span className="text-sm text-gray bg-gray-100 px-3 py-1 rounded-full">
                                                {list.length}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {list.map((p, idx) => {
                                                const internal = p?.type === "internal" && (p.user || p.userId);
                                                const u = p.user;
                                                const name = internal ? u?.name || "Member" : p?.name || "Guest";
                                                const email = internal ? u?.email : null;
                                                const designation = p?.designation || "";
                                                const org = p?.org || p?.organization || "";

                                                return (
                                                    <div
                                                        key={`${role}-${idx}`}
                                                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                                {name.charAt(0).toUpperCase()}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                {internal ? (
                                                                    <Link
                                                                        to={`/members/${u?.id || u?._id || p.userId}`}
                                                                        className="font-semibold text-primary hover:underline line-clamp-1 block"
                                                                    >
                                                                        {name}
                                                                    </Link>
                                                                ) : (
                                                                    <p className="font-semibold text-dark line-clamp-1">
                                                                        {name}
                                                                    </p>
                                                                )}

                                                                {email && (
                                                                    <p className="text-xs text-gray mt-1 line-clamp-1">
                                                                        {email}
                                                                    </p>
                                                                )}

                                                                {designation && (
                                                                    <p className="text-sm text-gray mt-1 line-clamp-1">
                                                                        {designation}
                                                                    </p>
                                                                )}

                                                                {org && (
                                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                                        {org}
                                                                    </p>
                                                                )}

                                                                <span
                                                                    className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${internal
                                                                            ? "bg-primary/10 text-primary"
                                                                            : "bg-gray-100 text-gray-600"
                                                                        }`}
                                                                >
                                                                    {internal ? "Member" : "Guest"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
