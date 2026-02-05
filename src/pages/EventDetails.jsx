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
    FaTimes,
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
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // registration ui
    const [showRegModal, setShowRegModal] = useState(false);
    const [submittingReg, setSubmittingReg] = useState(false);

    const [reg, setReg] = useState(null); // backend registration row
    const [paymentRequired, setPaymentRequired] = useState(false);

    const [regForm, setRegForm] = useState({
        name: "",
        email: "",
        phone: "",
        studentId: "",
        department: "",
        batch: "",
        organization: "",
    });

    const [paymentForm, setPaymentForm] = useState({
        paymentMethod: "bkash",
        transactionId: "",
    });

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

    const IconForRole = (role) => {
        if (role === "organizer") return FaUserTie;
        if (role === "volunteer") return FaHandsHelping;
        if (role === "core_adjudicator") return FaGavel;
        return FaListUl;
    };

    const closeRegModal = () => {
        setShowRegModal(false);
    };

    const handleRegister = async () => {
        if (!event) return;

        // basic guest validations (safe even if user logged in)
        if (!regForm.name.trim() || !regForm.email.trim()) {
            toast.error("Name and Email are required");
            return;
        }

        try {
            setSubmittingReg(true);

            // backend supports optionalAuth: if token exists -> internal, else guest
            const payload = {
                guestName: regForm.name,
                guestEmail: regForm.email,
                guestPhone: regForm.phone,
                // extra snapshots (if you later want to store them in EventRegistration model)
                studentId: regForm.studentId,
                department: regForm.department,
                batch: regForm.batch,
                organization: regForm.organization,
            };

            const res = await api.post(`/events/${event.id ?? event._id}/register`, payload);

            setReg(res.data?.data || null);
            setPaymentRequired(Boolean(res.data?.paymentRequired));
            toast.success(res.data?.message || "Registered");
        } catch (e) {
            const msg = e?.response?.data?.message || "Registration failed";
            toast.error(msg);
        } finally {
            setSubmittingReg(false);
        }
    };

    const handleSubmitPayment = async () => {
        if (!event || !reg) return;

        if (!paymentForm.paymentMethod || !paymentForm.transactionId.trim()) {
            toast.error("paymentMethod and transactionId are required");
            return;
        }

        try {
            const eventId = event.id ?? event._id;
            const regId = reg.id ?? reg._id;

            const res = await api.put(`/events/${eventId}/registrations/${regId}/payment`, {
                paymentMethod: paymentForm.paymentMethod,
                transactionId: paymentForm.transactionId.trim(),
            });

            setReg(res.data?.data || reg);
            toast.success(res.data?.message || "Payment submitted");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Payment submit failed");
        }
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
    const fee = Number(event.registrationFee || 0);
    const canRegister = Boolean(event.registrationOpen);

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

                                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                                    {event.accessType === "inter_club" ? "Inter Club (Login required)" : "Public"}
                                </span>

                                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                                    Fee: {fee === 0 ? "Free" : `${fee}৳`}
                                </span>

                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${canRegister ? "bg-green-500/80" : "bg-red-500/80"
                                        }`}
                                >
                                    {canRegister ? "Registration Open" : "Registration Closed"}
                                </span>
                            </div>

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
                                    <p className="font-semibold text-dark">{event.maxParticipants || "—"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Register CTA */}
                        <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                            <div className="text-sm text-gray">
                                {fee > 0 ? (
                                    <span>
                                        After registering, submit your payment TX to confirm.
                                    </span>
                                ) : (
                                    <span>Free registration will be confirmed instantly.</span>
                                )}
                            </div>

                            <button
                                disabled={!canRegister}
                                onClick={() => setShowRegModal(true)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${canRegister
                                        ? "bg-primary text-white hover:bg-primary-dark"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Register Now
                            </button>
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
                                const RoleIcon = IconForRole(role);
                                return (
                                    <div key={role}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <RoleIcon className="text-primary" />
                                            <h3 className="font-bold text-lg text-dark">{roleLabel(role)}</h3>
                                            <span className="text-sm text-gray">({list.length})</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {list.map((p, idx) => {
                                                const internal = p?.type === "internal" && (p.user || p.userId);
                                                const u = p.user;
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
                                                                    to={`/users/${u?._id || p.userId}`}
                                                                    className="font-semibold text-primary hover:underline"
                                                                >
                                                                    {name}
                                                                </Link>
                                                            ) : (
                                                                <p className="font-semibold text-dark">{name || "External"}</p>
                                                            )}
                                                            <p className="text-sm text-gray mt-1">{sub}</p>
                                                            <p className="text-xs mt-2 inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                                {internal ? "Internal" : "External"}
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

            {/* ================= Register Modal ================= */}
            {showRegModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold text-dark">Event Registration</h3>
                            <button onClick={closeRegModal} className="text-gray-500 hover:text-dark">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* If already registered */}
                            {reg ? (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <p className="font-semibold text-green-700">Registration Created ✅</p>
                                    <p className="text-sm text-gray mt-1">
                                        Registration ID: <span className="font-mono">{reg.id ?? reg._id}</span>
                                    </p>

                                    {paymentRequired ? (
                                        <p className="text-sm text-gray mt-2">
                                            Payment required: <b>{fee}৳</b>. Submit TX below.
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray mt-2">This event is free. You are confirmed.</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-semibold text-dark">Name *</label>
                                            <input
                                                value={regForm.name}
                                                onChange={(e) => setRegForm((p) => ({ ...p, name: e.target.value }))}
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                                placeholder="Your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-dark">Email *</label>
                                            <input
                                                value={regForm.email}
                                                onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))}
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                                placeholder="you@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-dark">Phone</label>
                                            <input
                                                value={regForm.phone}
                                                onChange={(e) => setRegForm((p) => ({ ...p, phone: e.target.value }))}
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                                placeholder="01XXXXXXXXX"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-dark">Organization</label>
                                            <input
                                                value={regForm.organization}
                                                onChange={(e) => setRegForm((p) => ({ ...p, organization: e.target.value }))}
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                                placeholder="University/College"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-dark">Student ID</label>
                                            <input
                                                value={regForm.studentId}
                                                onChange={(e) => setRegForm((p) => ({ ...p, studentId: e.target.value }))}
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                                placeholder="e.g. 2020-1-60-XXX"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-dark">Department</label>
                                            <input
                                                value={regForm.department}
                                                onChange={(e) => setRegForm((p) => ({ ...p, department: e.target.value }))}
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                                placeholder="e.g. CSE"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-dark">Batch</label>
                                            <input
                                                value={regForm.batch}
                                                onChange={(e) => setRegForm((p) => ({ ...p, batch: e.target.value }))}
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                                placeholder="e.g. 55"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleRegister}
                                        disabled={submittingReg}
                                        className="w-full px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-60"
                                    >
                                        {submittingReg ? "Registering..." : "Submit Registration"}
                                    </button>

                                    <p className="text-xs text-gray">
                                        Note: For inter-club events, login is required. If you are not logged in, you’ll get a login required error.
                                    </p>
                                </>
                            )}

                            {/* Payment submission (only if fee > 0 and reg exists) */}
                            {reg && fee > 0 && (
                                <div className="border-t pt-5 space-y-3">
                                    <h4 className="text-lg font-bold text-dark">Submit Payment</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-semibold text-dark">Payment Method</label>
                                            <select
                                                value={paymentForm.paymentMethod}
                                                onChange={(e) =>
                                                    setPaymentForm((p) => ({ ...p, paymentMethod: e.target.value }))
                                                }
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                            >
                                                <option value="bkash">bKash</option>
                                                <option value="nagad">Nagad</option>
                                                <option value="rocket">Rocket</option>
                                                <option value="bank">Bank</option>
                                                <option value="cash">Cash</option>
                                                <option value="sslcommerz">SSLCommerz</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-dark">Transaction ID</label>
                                            <input
                                                value={paymentForm.transactionId}
                                                onChange={(e) =>
                                                    setPaymentForm((p) => ({ ...p, transactionId: e.target.value }))
                                                }
                                                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                                placeholder="Enter TX ID"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmitPayment}
                                        className="w-full px-6 py-3 rounded-xl bg-dark text-white font-semibold hover:opacity-90"
                                    >
                                        Submit Payment TX
                                    </button>

                                    <p className="text-xs text-gray">
                                        After submitting TX, management will verify and confirm your registration.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={closeRegModal}
                                className="w-full px-6 py-3 rounded-xl bg-gray-100 text-dark font-semibold hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetails;
