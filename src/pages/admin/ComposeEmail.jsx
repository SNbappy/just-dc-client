// pages/admin/ComposeEmail.jsx
import { useState, useEffect } from 'react';
import { FaPaperPlane, FaUsers, FaUser, FaEnvelope, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ComposeEmail = () => {
    const [loading, setLoading] = useState(false);
    const [recipientGroups, setRecipientGroups] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        recipientType: 'all',
        recipients: [],
        subject: '',
        message: '',
        templateName: '',
        eventId: '',
    });

    const [showUserSelector, setShowUserSelector] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [groupsRes, templatesRes, eventsRes, usersRes] = await Promise.all([
                api.get('/emails/recipient-groups'),
                api.get('/emails/templates'),
                api.get('/events'),
                api.get('/users'),
            ]);

            setRecipientGroups(groupsRes.data?.data || []);
            setTemplates(templatesRes.data?.data || []);
            setEvents(eventsRes.data?.data || []);
            setUsers(usersRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleRecipientTypeChange = (type) => {
        setFormData({
            ...formData,
            recipientType: type,
            recipients: [],
        });
        setSelectedUsers([]);
    };

    const handleUserSelect = (user) => {
        const isSelected = selectedUsers.some((u) => u.id === user.id);

        if (isSelected) {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const applyUserSelection = () => {
        setFormData({
            ...formData,
            recipients: selectedUsers.map((u) => u.id),
        });
        setShowUserSelector(false);
    };

    const handleTemplateChange = (templateName) => {
        setFormData({ ...formData, templateName });

        const template = templates.find((t) => t.name === templateName);
        if (template?.requiresEvent) {
            // Template requires event selection
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subject || !formData.message) {
            toast.error('Subject and message are required');
            return;
        }

        if (formData.recipientType === 'individual' && formData.recipients.length === 0) {
            toast.error('Please select at least one recipient');
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                recipients: formData.recipientType === 'role' ? [formData.recipients[0]] : formData.recipients,
            };

            const res = await api.post('/emails/send', payload);

            toast.success(res.data?.message || 'Email sent successfully');

            // Reset form
            setFormData({
                recipientType: 'all',
                recipients: [],
                subject: '',
                message: '',
                templateName: '',
                eventId: '',
            });
            setSelectedUsers([]);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-heading font-bold text-3xl text-dark">Compose Email</h1>
                <Link
                    to="/dashboard/manage/email-logs"
                    className="px-4 py-2 bg-gray-100 text-dark rounded-xl hover:bg-gray-200 font-semibold"
                >
                    View History
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
                {/* Recipient Type */}
                <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Send To</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <button
                            type="button"
                            onClick={() => handleRecipientTypeChange('all')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${formData.recipientType === 'all'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FaUsers className="text-primary mb-2" />
                            <p className="font-semibold text-dark">All Members</p>
                            <p className="text-xs text-gray">
                                {recipientGroups.find((g) => g.value === 'all')?.count || 0} members
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRecipientTypeChange('role')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${formData.recipientType === 'role'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FaUser className="text-primary mb-2" />
                            <p className="font-semibold text-dark">By Role</p>
                            <p className="text-xs text-gray">Admins, Members, etc.</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRecipientTypeChange('individual')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${formData.recipientType === 'individual'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FaEnvelope className="text-primary mb-2" />
                            <p className="font-semibold text-dark">Select Users</p>
                            <p className="text-xs text-gray">Choose specific members</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRecipientTypeChange('event')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${formData.recipientType === 'event'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FaUsers className="text-primary mb-2" />
                            <p className="font-semibold text-dark">Event Participants</p>
                            <p className="text-xs text-gray">Send to event attendees</p>
                        </button>
                    </div>
                </div>

                {/* Role Selection */}
                {formData.recipientType === 'role' && (
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Select Role</label>
                        <select
                            value={formData.recipients[0] || ''}
                            onChange={(e) => setFormData({ ...formData, recipients: [e.target.value] })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        >
                            <option value="">Choose role...</option>
                            {recipientGroups
                                .filter((g) => g.value !== 'all')
                                .map((group) => (
                                    <option key={group.value} value={group.value}>
                                        {group.label} ({group.count})
                                    </option>
                                ))}
                        </select>
                    </div>
                )}

                {/* Individual Selection */}
                {formData.recipientType === 'individual' && (
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Select Users</label>
                        <button
                            type="button"
                            onClick={() => setShowUserSelector(true)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-primary focus:border-primary focus:outline-none text-left"
                        >
                            {selectedUsers.length > 0
                                ? `${selectedUsers.length} user(s) selected`
                                : 'Click to select users...'}
                        </button>

                        {selectedUsers.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedUsers.map((user) => (
                                    <span
                                        key={user.id}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                    >
                                        {user.name}
                                        <button
                                            type="button"
                                            onClick={() => handleUserSelect(user)}
                                            className="hover:text-red-600"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Event Selection */}
                {formData.recipientType === 'event' && (
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Select Event</label>
                        <select
                            value={formData.eventId}
                            onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        >
                            <option value="">Choose event...</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Template Selection */}
                <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Email Template (Optional)</label>
                    <select
                        value={formData.templateName}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                    >
                        <option value="">No template (Custom)</option>
                        {templates.map((template) => (
                            <option key={template.name} value={template.name}>
                                {template.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Subject *</label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Enter email subject..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Message *</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Enter your message..."
                        rows={10}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none resize-none"
                        required
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Sending...
                        </>
                    ) : (
                        <>
                            <FaPaperPlane />
                            Send Email
                        </>
                    )}
                </button>
            </form>

            {/* User Selector Modal */}
            {showUserSelector && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold text-dark">Select Users</h3>
                            <button onClick={() => setShowUserSelector(false)} className="text-gray-500 hover:text-dark">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            <div className="space-y-2">
                                {users.map((user) => {
                                    const isSelected = selectedUsers.some((u) => u.id === user.id);
                                    return (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => handleUserSelect(user)}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <p className="font-semibold text-dark">{user.name}</p>
                                            <p className="text-sm text-gray">{user.email}</p>
                                            <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-5 border-t">
                            <button
                                onClick={applyUserSelection}
                                className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark"
                            >
                                Select {selectedUsers.length} User(s)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComposeEmail;
