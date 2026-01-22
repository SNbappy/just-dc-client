import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendar, FaMapMarkerAlt, FaClock, FaSearch, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

const EventsManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'workshop',
        maxParticipants: '',
        image: '',
    });

    const [errors, setErrors] = useState({});

    // Fetch events
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
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const eventDate = new Date(event.date);
        const today = new Date();

        if (filter === 'upcoming') {
            return matchesSearch && eventDate >= today;
        } else if (filter === 'past') {
            return matchesSearch && eventDate < today;
        }
        return matchesSearch;
    });

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        return newErrors;
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image size should not exceed 10MB');
            return;
        }

        setUploadingImage(true);

        try {
            const formDataImg = new FormData();
            formDataImg.append('image', file);
            formDataImg.append('folder', 'just-dc/events');

            const response = await api.post('/upload', formDataImg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = response.data.data.url;
            setFormData(prev => ({ ...prev, image: imageUrl }));
            setImagePreview(imageUrl);
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    // Remove uploaded image
    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
        setImagePreview('');
    };

    // Handle submit (Create/Update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent._id}`, formData);
            } else {
                await api.post('/events', formData);
            }

            fetchEvents();
            closeModal();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error saving event. Please try again.');
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Error deleting event. Please try again.');
            }
        }
    };

    // Open modal for create
    const openCreateModal = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            category: 'workshop',
            maxParticipants: '',
            image: '',
        });
        setErrors({});
        setImagePreview('');
        setShowModal(true);
    };

    // Open modal for edit
    const openEditModal = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
            category: event.category,
            maxParticipants: event.maxParticipants || '',
            image: event.image || '',
        });
        setErrors({});
        setImagePreview(event.image || '');
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            category: 'workshop',
            maxParticipants: '',
            image: '',
        });
        setErrors({});
        setImagePreview('');
    };

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
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${filter === 'all'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${filter === 'upcoming'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${filter === 'past'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Past
                        </button>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <div
                        key={event._id}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="h-48 bg-gradient-to-br from-primary to-secondary relative">
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

                            <p className="text-gray text-sm mb-4 line-clamp-2">
                                {event.description}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray text-sm">
                                    <FaCalendar className="text-primary" />
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
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
                                    onClick={() => handleDelete(event._id)}
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
                    <h3 className="font-heading font-bold text-xl text-dark mb-2">
                        No events found
                    </h3>
                    <p className="text-gray">
                        {searchTerm ? 'Try a different search term' : 'Create your first event to get started'}
                    </p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h2 className="font-heading font-bold text-2xl text-dark">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-dark transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.title ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-primary focus:outline-none`}
                                    placeholder="Enter event title"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.description ? 'border-red-500' : 'border-gray-200'
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
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.date ? 'border-red-500' : 'border-gray-200'
                                            } focus:border-primary focus:outline-none`}
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.time ? 'border-red-500' : 'border-gray-200'
                                            } focus:border-primary focus:outline-none`}
                                    />
                                    {errors.time && (
                                        <p className="mt-1 text-sm text-red-500">{errors.time}</p>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.location ? 'border-red-500' : 'border-gray-200'
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
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Category
                                    </label>
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
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Event Image
                                </label>

                                {/* Image Preview */}
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

                                {/* Upload Button */}
                                <div className="flex gap-2">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="px-4 py-3 bg-primary text-white text-center font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                                            {uploadingImage ? 'Uploading...' : 'Choose Image'}
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
                                <p className="text-xs text-gray mt-2">
                                    Max file size: 10MB. Supports: JPG, PNG, WEBP
                                </p>
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
                                    {editingEvent ? 'Update Event' : 'Create Event'}
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
