import { useEffect, useMemo, useState } from "react";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaCalendar,
    FaMapMarkerAlt,
    FaClock,
    FaSearch,
    FaTimes,
    FaUserPlus,
    FaExternalLinkAlt,
} from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";

const PARTICIPANT_ROLES = [
    { value: "organizer", label: "Organizer" },
    { value: "volunteer", label: "Volunteer" },
    { value: "core_adjudicator", label: "Core Adjudicator" },
    { value: "tab_team", label: "Tab Team" },
    { value: "speaker", label: "Speaker" },
    { value: "guest", label: "Guest" },
];

const EventsManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    // ===== NEW: user search for internal participants =====
    const [userSearch, setUserSearch] = useState("");
    const [userSearchLoading, setUserSearchLoading] = useState(false);
    const [userResults, setUserResults] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "workshop",
        maxParticipants: "",
        image: "",

        // ===== NEW: participants =====
        participants: [], // [{ role, type, userId?, name?, designation?, org? }]
    });

    const [errors, setErrors] = useState({});

    // Fetch events
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get("/events");
            setEvents(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
            toast.error("Failed to fetch events");
        } finally {
            setLoading(false);
        }
    };

    // Filter events
    const filteredEvents = events.filter((event) => {
        const matchesSearch = (event.title || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const eventDate = new Date(event.date);
        const today = new Date();

        if (filter === "upcoming") return matchesSearch && eventDate >= today;
        if (filter === "past") return matchesSearch && eventDate < today;
        return matchesSearch;
    });

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.time) newErrors.time = "Time is required";
        if (!formData.location.trim()) newErrors.location = "Location is required";
        return newErrors;
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size should not exceed 10MB");
            return;
        }

        setUploadingImage(true);

        try {
            const formDataImg = new FormData();
            formDataImg.append("image", file);
            formDataImg.append("folder", "just-dc/events");

            const response = await api.post("/upload", formDataImg, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = response?.data?.data?.url;
            if (!imageUrl) throw new Error("Upload response missing url");

            setFormData((prev) => ({ ...prev, image: imageUrl }));
            setImagePreview(imageUrl);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: "" }));
        setImagePreview("");
    };

    // ===== NEW: Internal User Search (for participant type=internal) =====
    useEffect(() => {
        const run = async () => {
            const q = userSearch.trim();
            if (!q) {
                setUserResults([]);
                return;
            }

            setUserSearchLoading(true);
            try {
                // ✅ Uses your existing GET /api/users?search=...
                const res = await api.get("/users", { params: { search: q } });
                setUserResults(res?.data?.data || []);
            } catch (e) {
                console.error(e);
                setUserResults([]);
            } finally {
                setUserSearchLoading(false);
            }
        };

        const t = setTimeout(run, 300);
        return () => clearTimeout(t);
    }, [userSearch]);

    // ===== NEW: Participants helpers =====
    const addExternalParticipant = () => {
        setFormData((prev) => ({
            ...prev,
            participants: [
                ...prev.participants,
                { role: "volunteer", type: "external", name: "", designation: "", org: "" },
            ],
        }));
    };

    const addInternalParticipant = (user) => {
        if (!user?.id) return;

        // prevent duplicates by same userId+role (simple)
        const exists = formData.participants.some(
            (p) => p.type === "internal" && String(p.userId) === String(user.id)
        );
        if (exists) {
            toast("User already added");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            participants: [
                ...prev.participants,
                { role: "volunteer", type: "internal", userId: user.id, user },
            ],
        }));
        toast.success("Added");
    };

    const updateParticipant = (idx, patch) => {
        setFormData((prev) => {
            const copy = [...prev.participants];
            copy[idx] = { ...copy[idx], ...patch };
            return { ...prev, participants: copy };
        });
    };

    const removeParticipant = (idx) => {
        setFormData((prev) => {
            const copy = [...prev.participants];
            copy.splice(idx, 1);
            return { ...prev, participants: copy };
        });
    };

    const roleLabel = (role) =>
        PARTICIPANT_ROLES.find((r) => r.value === role)?.label || role;

    // Handle submit (Create/Update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clean participants before send
        const cleanedParticipants = (formData.participants || []).map((p) => {
            if (p.type === "internal") {
                return { role: p.role, type: "internal", userId: p.userId };
            }
            return {
                role: p.role,
                type: "external",
                name: (p.name || "").trim(),
                designation: (p.designation || "").trim(),
                org: (p.org || "").trim(),
            };
        });

        const payload = {
            ...formData,
            participants: cleanedParticipants,
        };

        try {
            if (editingEvent) {
                const id = editingEvent.id ?? editingEvent._id;
                await api.put(`/events/${id}`, payload);
                toast.success("Event updated");
            } else {
                await api.post("/events", payload);
                toast.success("Event created");
            }

            fetchEvents();
            closeModal();
        } catch (error) {
            console.error("Error saving event:", error);
            toast.error(error?.response?.data?.message || "Error saving event");
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await api.delete(`/events/${id}`);
                toast.success("Event deleted");
                fetchEvents();
            } catch (error) {
                console.error("Error deleting event:", error);
                toast.error("Error deleting event");
            }
        }
    };

    // Open modal for create
    const openCreateModal = () => {
        setEditingEvent(null);
        setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            category: "workshop",
            maxParticipants: "",
            image: "",
            participants: [],
        });
        setErrors({});
        setImagePreview("");
        setUserSearch("");
        setUserResults([]);
        setShowModal(true);
    };

    // Open modal for edit
    const openEditModal = (event) => {
        setEditingEvent(event);

        setFormData({
            title: event.title || "",
            description: event.description || "",
            date: event.date ? String(event.date).split("T")[0] : "",
            time: event.time || "",
            location: event.location || "",
            category: event.category || "workshop",
            maxParticipants: event.maxParticipants || "",
            image: event.image || "",

            // if backend returns participants, keep it; else []
            participants: Array.isArray(event.participants) ? event.participants : [],
        });

        setErrors({});
        setImagePreview(event.image || "");
        setUserSearch("");
        setUserResults([]);
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setErrors({});
        setImagePreview("");
        setUserSearch("");
        setUserResults([]);
    };

    const eventIdKey = (ev) => ev.id ?? ev._id;

    // ===== Render =====
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-heading font-bold text-3xl text-dark mb-2">
                        Events Management
                    </h1>
                    <p className="text-gray">Manage all club events and activities</p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                >
                    <FaPlus />
                    Add New Event
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-2">
                        {["all", "upcoming", "past"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${filter === f
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <div
                        key={eventIdKey(event)}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="h-48 bg-gradient-to-br from-primary to-secondary relative">
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaCalendar className="text-6xl text-white opacity-50" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-white text-primary text-sm font-semibold rounded-full">
                                    {event.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="font-heading font-bold text-xl text-dark mb-3 line-clamp-2">
                                {event.title}
                            </h3>

                            <p className="text-gray text-sm mb-4 line-clamp-2">{event.description}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray text-sm">
                                    <FaCalendar className="text-primary" />
                                    {new Date(event.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                                <div className="flex items-center gap-2 text-gray text-sm">
                                    <FaClock className="text-primary" />
                                    {event.time}
                                </div>
                                <div className="flex items-center gap-2 text-gray text-sm">
                                    <FaMapMarkerAlt className="text-primary" />
                                    {event.location}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(event)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-xl hover:bg-blue-200 transition-colors"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(eventIdKey(event))}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
                                >
                                    <FaTrash />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                    <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-xl text-dark mb-2">No events found</h3>
                    <p className="text-gray">
                        {searchTerm ? "Try a different search term" : "Create your first event to get started"}
                    </p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h2 className="font-heading font-bold text-2xl text-dark">
                                {editingEvent ? "Edit Event" : "Create New Event"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-dark transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">Event Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.title ? "border-red-500" : "border-gray-200"
                                        } focus:border-primary focus:outline-none`}
                                    placeholder="Enter event title"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.description ? "border-red-500" : "border-gray-200"
                                        } focus:border-primary focus:outline-none`}
                                    placeholder="Enter event description"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.date ? "border-red-500" : "border-gray-200"
                                            } focus:border-primary focus:outline-none`}
                                    />
                                    {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">Time *</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.time ? "border-red-500" : "border-gray-200"
                                            } focus:border-primary focus:outline-none`}
                                    />
                                    {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.location ? "border-red-500" : "border-gray-200"
                                        } focus:border-primary focus:outline-none`}
                                    placeholder="Enter event location"
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                                )}
                            </div>

                            {/* Category and Max Participants */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                    >
                                        <option value="workshop">Workshop</option>
                                        <option value="tournament">Tournament</option>
                                        <option value="practice">Practice Session</option>
                                        <option value="seminar">Seminar</option>
                                        <option value="competition">Competition</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Max Participants
                                    </label>
                                    <input
                                        type="number"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                        placeholder="50"
                                    />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">Event Image</label>

                                {(imagePreview || formData.image) && (
                                    <div className="mb-4 relative">
                                        <img
                                            src={imagePreview || formData.image}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="px-4 py-3 bg-primary text-white text-center font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                                            {uploadingImage ? "Uploading..." : "Choose Image"}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploadingImage}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray mt-2">Max file size: 10MB. Supports: JPG, PNG, WEBP</p>
                            </div>

                            {/* ================= NEW: People / Participants ================= */}
                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-dark">People (Volunteers, Organizers, etc.)</h3>
                                        <p className="text-sm text-gray">
                                            Internal members will be clickable later, external guests won't.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addExternalParticipant}
                                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-dark font-semibold flex items-center gap-2"
                                    >
                                        <FaUserPlus />
                                        Add External
                                    </button>
                                </div>

                                {/* Internal user search */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Add Internal Member
                                    </label>
                                    <div className="relative">
                                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            placeholder="Search by name/email/studentId..."
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                        />
                                    </div>

                                    {userSearch && (
                                        <div className="mt-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                                            {userSearchLoading ? (
                                                <div className="p-4 text-sm text-gray">Searching...</div>
                                            ) : userResults.length === 0 ? (
                                                <div className="p-4 text-sm text-gray">No users found</div>
                                            ) : (
                                                <div className="max-h-56 overflow-y-auto">
                                                    {userResults.map((u) => (
                                                        <div
                                                            key={u.id ?? u._id}
                                                            className="flex items-center justify-between p-3 border-b last:border-b-0"
                                                        >
                                                            <div>
                                                                <p className="font-semibold text-dark">{u.name}</p>
                                                                <p className="text-xs text-gray">{u.email}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => addInternalParticipant(u)}
                                                                className="px-3 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark"
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Participants list */}
                                {formData.participants.length === 0 ? (
                                    <div className="text-sm text-gray italic">No people added yet.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.participants.map((p, idx) => (
                                            <div key={idx} className="border border-gray-200 rounded-2xl p-4 bg-white">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            {/* Role */}
                                                            <div>
                                                                <label className="text-xs text-gray font-semibold">Role</label>
                                                                <select
                                                                    value={p.role || "volunteer"}
                                                                    onChange={(e) => updateParticipant(idx, { role: e.target.value })}
                                                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                                                                >
                                                                    {PARTICIPANT_ROLES.map((r) => (
                                                                        <option key={r.value} value={r.value}>
                                                                            {r.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Type */}
                                                            <div>
                                                                <label className="text-xs text-gray font-semibold">Type</label>
                                                                <input
                                                                    value={p.type === "internal" ? "Internal (Clickable)" : "External (Not Clickable)"}
                                                                    disabled
                                                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                                                                />
                                                            </div>

                                                            {/* Person */}
                                                            <div>
                                                                <label className="text-xs text-gray font-semibold">Person</label>

                                                                {p.type === "internal" ? (
                                                                    <div className="mt-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                                                                        <div>
                                                                            <p className="font-semibold text-dark">
                                                                                {p.user?.name || `User ID: ${p.userId}`}
                                                                            </p>
                                                                            <p className="text-xs text-gray">{p.user?.email || ""}</p>
                                                                        </div>
                                                                        <FaExternalLinkAlt className="text-gray-400" title="Will be clickable later" />
                                                                    </div>
                                                                ) : (
                                                                    <input
                                                                        value={p.name || ""}
                                                                        onChange={(e) => updateParticipant(idx, { name: e.target.value })}
                                                                        placeholder="Name (external person)"
                                                                        className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* External extra info */}
                                                        {p.type !== "internal" && (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                                                <div>
                                                                    <label className="text-xs text-gray font-semibold">Designation</label>
                                                                    <input
                                                                        value={p.designation || ""}
                                                                        onChange={(e) => updateParticipant(idx, { designation: e.target.value })}
                                                                        placeholder="e.g. Core Adjudicator"
                                                                        className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-xs text-gray font-semibold">Organization</label>
                                                                    <input
                                                                        value={p.org || ""}
                                                                        onChange={(e) => updateParticipant(idx, { org: e.target.value })}
                                                                        placeholder="e.g. XYZ University"
                                                                        className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeParticipant(idx)}
                                                        className="px-3 py-2 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <div className="mt-3 text-xs text-gray">
                                                    ✅ Role: <b>{roleLabel(p.role)}</b> •{" "}
                                                    {p.type === "internal" ? "Clickable profile later" : "Not clickable"}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-dark font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                                >
                                    {editingEvent ? "Update Event" : "Create Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsManagement;
