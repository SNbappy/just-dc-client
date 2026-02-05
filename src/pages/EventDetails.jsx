import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const iconForRole = (role) => {
    if (role === "organizer") return FaUserTie;
    if (role === "volunteer") return FaHandsHelping;
    if (role === "core_adjudicator") return FaGavel;
    return FaListUl;
};

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/events/${id}`);
                setEvent(res.data?.data || null);
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

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="h-64 bg-gradient-to-br from-primary to-secondary relative">
                        {event.image ? (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : null}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                {event.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold mt-3">{event.title}</h1>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <p className="text-gray leading-relaxed">{event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <FaCalendar className="text-primary" />
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
                                <FaClock className="text-primary" />
                                <div>
                                    <p className="text-xs text-gray">Time</p>
                                    <p className="font-semibold text-dark">{event.time}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <FaMapMarkerAlt className="text-primary" />
                                <div>
                                    <p className="text-xs text-gray">Location</p>
                                    <p className="font-semibold text-dark">{event.location}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                <FaUsers className="text-primary" />
                                <div>
                                    <p className="text-xs text-gray">Max</p>
                                    <p className="font-semibold text-dark">
                                        {event.maxParticipants ? event.maxParticipants : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participants */}
                <div className="mt-8 bg-white rounded-2xl shadow-md p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-dark mb-4">People</h2>

                    {Object.keys(grouped).length === 0 ? (
                        <p className="text-gray">No people added yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(grouped).map(([role, list]) => {
                                const RoleIcon = iconForRole(role);
                                return (
                                    <div key={role}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <RoleIcon className="text-primary" />
                                            <h3 className="font-bold text-lg text-dark">{roleLabel(role)}</h3>
                                            <span className="text-sm text-gray">({list.length})</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {list.map((p, idx) => {
                                                const internal =
                                                    p?.type === "internal" && (p.user || p.userId);

                                                const u = p.user;
                                                const internalId = u?._id || u?.id || p.userId;

                                                const name = internal ? (u?.name || "Member") : p?.name;
                                                const sub = internal
                                                    ? (u?.email || "")
                                                    : [p?.designation, p?.org].filter(Boolean).join(" • ");

                                                return (
                                                    <div
                                                        key={`${role}-${idx}`}
                                                        className="border rounded-xl p-4 flex items-start justify-between gap-3"
                                                    >
                                                        <div>
                                                            {internal ? (
                                                                <Link
                                                                    to={`/member/${internalId}`}
                                                                    className="font-semibold text-primary hover:underline"
                                                                >
                                                                    {name}
                                                                </Link>
                                                            ) : (
                                                                <p className="font-semibold text-dark">
                                                                    {name || "External"}
                                                                </p>
                                                            )}

                                                            <p className="text-sm text-gray mt-1">{sub}</p>

                                                            <p className="text-xs mt-2 inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                                {internal ? "Internal (Clickable)" : "External (Not Clickable)"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
