// src/pages/admin/EventsManagement.jsx
import { useEffect, useState } from 'react';
import {
    FaPlus,
    FaSearch,
    FaCalendar,
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import EventCard from '../components/events/EventCard';
import EventFormModal from '../components/events/EventFormModal';

const EventsManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [errors, setErrors] = useState({});
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
        categories: [],
        participants: [],
    });

    // Fetch events
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            const eventsData = response?.data?.data || [];

            // ✅ DEBUG: Check the first event's structure
            if (eventsData.length > 0) {
                const firstEvent = eventsData[0];
                console.log('🔍 BACKEND RESPONSE - First Event:');
                console.log('- ID:', firstEvent.id || firstEvent._id);
                console.log('- Title:', firstEvent.title);
                console.log('- Categories Type:', typeof firstEvent.categories);
                console.log('- Categories Value:', firstEvent.categories);
                console.log('- Participants Type:', typeof firstEvent.participants);
                console.log('- Participants Value:', firstEvent.participants);

                // Try parsing if string
                if (typeof firstEvent.categories === 'string') {
                    try {
                        const parsed = JSON.parse(firstEvent.categories);
                        console.log('✅ Parsed Categories:', parsed);
                    } catch (e) {
                        console.error('❌ Cannot parse categories:', e);
                    }
                }
            }

            setEvents(eventsData);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
            toast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    // Filter events
    const filteredEvents = events.filter((event) => {
        const matchesSearch = (event.title || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const eventDate = new Date(event.date);
        const today = new Date();

        if (filter === 'upcoming') return matchesSearch && eventDate >= today;
        if (filter === 'past') return matchesSearch && eventDate < today;
        return matchesSearch;
    });

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                toast.success('Event deleted');
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                toast.error(error?.response?.data?.message || 'Error deleting event');
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
            categories: [],
            participants: [],
        });
        setErrors({});
        setImagePreview('');
        setShowModal(true);
    };

    // Open modal for edit
    const openEditModal = (event) => {
        console.log('🔍 RAW EVENT DATA:', event);

        setEditingEvent(event);

        // ✅ FIXED: Properly parse categories
        let categories = [];
        if (event.categories) {
            console.log('📦 Categories Type:', typeof event.categories);
            console.log('📦 Categories Value:', event.categories);

            if (typeof event.categories === 'string') {
                try {
                    // Try parsing as JSON string
                    const parsed = JSON.parse(event.categories);
                    categories = Array.isArray(parsed) ? parsed : [];
                    console.log('✅ Parsed categories from string:', categories);
                } catch (e) {
                    console.error('❌ Error parsing categories:', e);
                    categories = [];
                }
            } else if (Array.isArray(event.categories)) {
                categories = event.categories;
                console.log('✅ Categories already array:', categories);
            }
        }

        // ✅ FIXED: Properly parse participants
        let participants = [];
        if (event.participants) {
            console.log('👥 Participants Type:', typeof event.participants);
            console.log('👥 Participants Value:', event.participants);

            if (typeof event.participants === 'string') {
                try {
                    const parsed = JSON.parse(event.participants);
                    participants = Array.isArray(parsed) ? parsed : [];
                    console.log('✅ Parsed participants from string:', participants);
                } catch (e) {
                    console.error('❌ Error parsing participants:', e);
                    participants = [];
                }
            } else if (Array.isArray(event.participants)) {
                participants = event.participants;
                console.log('✅ Participants already array:', participants);
            }
        }

        // Set form data with parsed values
        const newFormData = {
            title: event.title || '',
            description: event.description || '',
            date: event.date ? String(event.date).split('T')[0] : '',
            time: event.time || '',
            location: event.location || '',
            category: event.category || 'workshop',
            maxParticipants: event.maxParticipants || '',
            image: event.image || '',
            categories: categories,
            participants: participants,
        };

        console.log('✅ FINAL FORM DATA:', newFormData);
        console.log('📊 Categories Count:', categories.length);
        console.log('👥 Participants Count:', participants.length);

        setFormData(newFormData);
        setErrors({});
        setImagePreview(event.image || '');
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setErrors({});
        setImagePreview('');
    };

    // Handle form submit
    const handleFormSubmit = async (data) => {
        try {
            if (editingEvent) {
                const id = editingEvent.id ?? editingEvent._id;
                console.log('📤 UPDATING EVENT:', id);
                console.log('📤 PAYLOAD:', data);
                await api.put(`/events/${id}`, data);
                toast.success('Event updated successfully');
            } else {
                console.log('📤 CREATING EVENT');
                console.log('📤 PAYLOAD:', data);
                await api.post('/events', data);
                toast.success('Event created successfully');
            }

            fetchEvents();
            closeModal();
        } catch (error) {
            console.error('Error saving event:', error);
            console.error('Error response:', error?.response?.data);
            throw error; // Let the modal handle the error
        }
    };

    // Render
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
                        {['all', 'upcoming', 'past'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${filter === f
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                    <EventCard
                        key={event.id ?? event._id}
                        event={event}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                    <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-xl text-dark mb-2">No events found</h3>
                    <p className="text-gray">
                        {searchTerm ? 'Try a different search term' : 'Create your first event to get started'}
                    </p>
                </div>
            )}

            {/* Event Form Modal */}
            {showModal && (
                <EventFormModal
                    show={showModal}
                    onClose={closeModal}
                    initialData={formData}
                    isEditing={!!editingEvent}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default EventsManagement;
