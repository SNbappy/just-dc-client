// pages/admin/ComposeEmail.jsx
import { useState, useEffect } from 'react';
import { FaEnvelope, FaUsers, FaUser, FaUserTag, FaPaperPlane, FaAt, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ComposeEmail = () => {
    const [recipientType, setRecipientType] = useState('individual');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [customEmails, setCustomEmails] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const roles = [
        { value: 'user', label: 'Users' },
        { value: 'member', label: 'Members' },
        { value: 'executive_member', label: 'Executive Members' },
        { value: 'general_secretary', label: 'General Secretary' },
        { value: 'president', label: 'President' },
        { value: 'moderator', label: 'Moderators' },
        { value: 'admin', label: 'Admins' },
    ];

    useEffect(() => {
        if (recipientType === 'individual') {
            fetchUsers();
        }
    }, [recipientType]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleUserToggle = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSelectAllUsers = () => {
        const filteredUserIds = filteredUsers.map((u) => u.id);
        if (selectedUsers.length === filteredUserIds.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUserIds);
        }
    };

    const handleRoleToggle = (role) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            toast.error('Subject and message are required');
            return;
        }

        // Validate based on recipient type
        if (recipientType === 'individual' && selectedUsers.length === 0) {
            toast.error('Please select at least one user');
            return;
        }

        if (recipientType === 'role' && selectedRoles.length === 0) {
            toast.error('Please select at least one role');
            return;
        }

        if (recipientType === 'custom') {
            const emails = customEmails.split(/[,;\n]/).map((e) => e.trim()).filter(Boolean);
            if (emails.length === 0) {
                toast.error('Please enter at least one email address');
                return;
            }

            // Basic validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const invalidEmails = emails.filter((email) => !emailRegex.test(email));
            if (invalidEmails.length > 0) {
                toast.error(`Invalid email addresses: ${invalidEmails.slice(0, 3).join(', ')}${invalidEmails.length > 3 ? '...' : ''}`);
                return;
            }
        }

        try {
            setSending(true);

            const payload = {
                recipientType,
                subject,
                message,
            };

            if (recipientType === 'individual') {
                payload.recipients = selectedUsers;
            } else if (recipientType === 'role') {
                payload.recipients = selectedRoles;
            } else if (recipientType === 'custom') {
                payload.customEmails = customEmails
                    .split(/[,;\n]/)
                    .map((e) => e.trim())
                    .filter(Boolean);
            }

            const res = await api.post('/emails/send', payload);

            if (res.data?.success) {
                toast.success(res.data.message || 'Email sent successfully!');

                // Reset form
                setSubject('');
                setMessage('');
                setSelectedUsers([]);
                setSelectedRoles([]);
                setCustomEmails('');
                setRecipientType('individual');
            } else {
                toast.error(res.data?.message || 'Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error(error.response?.data?.message || 'Failed to send email');
        } finally {
            setSending(false);
        }
    };

    // Filter users based on search
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get recipient count
    const getRecipientCount = () => {
        switch (recipientType) {
            case 'all':
                return users.length;
            case 'role':
                return users.filter((u) => selectedRoles.includes(u.role)).length;
            case 'individual':
                return selectedUsers.length;
            case 'custom':
                return customEmails.split(/[,;\n]/).map((e) => e.trim()).filter(Boolean).length;
            default:
                return 0;
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-heading font-bold text-3xl text-dark">Compose Email</h1>
                <p className="text-gray mt-1">Send emails to members, users, or custom addresses</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Type Selection */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <label className="block text-sm font-semibold text-dark mb-3">Select Recipients</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <button
                            type="button"
                            onClick={() => setRecipientType('all')}
                            className={`p-4 rounded-xl border-2 transition-all ${recipientType === 'all'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FaUsers
                                className={`text-2xl mx-auto mb-2 ${recipientType === 'all' ? 'text-primary' : 'text-gray'
                                    }`}
                            />
                            <p className="font-semibold text-sm text-dark">All Members</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRecipientType('role')}
                            className={`p-4 rounded-xl border-2 transition-all ${recipientType === 'role'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FaUserTag
                                className={`text-2xl mx-auto mb-2 ${recipientType === 'role' ? 'text-primary' : 'text-gray'
                                    }`}
                            />
                            <p className="font-semibold text-sm text-dark">By Role</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRecipientType('individual')}
                            className={`p-4 rounded-xl border-2 transition-all ${recipientType === 'individual'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FaUser
                                className={`text-2xl mx-auto mb-2 ${recipientType === 'individual' ? 'text-primary' : 'text-gray'
                                    }`}
                            />
                            <p className="font-semibold text-sm text-dark">Individuals</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRecipientType('custom')}
                            className={`p-4 rounded-xl border-2 transition-all ${recipientType === 'custom'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FaAt
                                className={`text-2xl mx-auto mb-2 ${recipientType === 'custom' ? 'text-primary' : 'text-gray'
                                    }`}
                            />
                            <p className="font-semibold text-sm text-dark">Custom Email</p>
                        </button>
                    </div>
                </div>

                {/* Role Selection */}
                {recipientType === 'role' && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <label className="block text-sm font-semibold text-dark mb-3">Select Roles</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {roles.map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => handleRoleToggle(role.value)}
                                    className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${selectedRoles.includes(role.value)
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 text-gray hover:border-gray-300'
                                        }`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                        {selectedRoles.length > 0 && (
                            <p className="text-sm text-primary mt-3 font-medium">
                                Selected: {selectedRoles.length} role(s) • ~
                                {users.filter((u) => selectedRoles.includes(u.role)).length} recipients
                            </p>
                        )}
                    </div>
                )}

                {/* Individual User Selection */}
                {recipientType === 'individual' && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-dark">
                                Select Users ({selectedUsers.length} selected)
                            </label>
                            <button
                                type="button"
                                onClick={handleSelectAllUsers}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        {/* Search */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users by name or email..."
                            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {filteredUsers.length === 0 ? (
                                    <p className="text-center text-gray py-8">No users found</p>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <label
                                            key={user.id}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleUserToggle(user.id)}
                                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-dark">{user.name}</p>
                                                <p className="text-sm text-gray">{user.email}</p>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray rounded-full font-medium">
                                                {user.role}
                                            </span>
                                        </label>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Custom Email Input */}
                {recipientType === 'custom' && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <label className="block text-sm font-semibold text-dark mb-3">
                            Enter Email Addresses
                        </label>
                        <textarea
                            value={customEmails}
                            onChange={(e) => setCustomEmails(e.target.value)}
                            placeholder="Enter email addresses separated by commas, semicolons, or new lines&#10;&#10;Example:&#10;john@example.com&#10;jane@example.com, bob@example.com&#10;alice@example.com; charlie@example.com"
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                        />
                        <p className="text-xs text-gray mt-2">
                            💡 Tip: Separate emails with commas, semicolons, or new lines
                        </p>
                        {customEmails && (
                            <div className="mt-3 flex items-center gap-2">
                                <p className="text-sm text-primary font-medium">
                                    {customEmails.split(/[,;\n]/).map((e) => e.trim()).filter(Boolean).length} email(s) detected
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setCustomEmails('')}
                                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                                >
                                    <FaTimes size={12} />
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Subject */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <label className="block text-sm font-semibold text-dark mb-3">
                        Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    />
                </div>

                {/* Message */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <label className="block text-sm font-semibold text-dark mb-3">
                        Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message..."
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        required
                    />
                    <p className="text-xs text-gray mt-2">{message.length} characters</p>
                </div>

                {/* Summary & Submit */}
                <div className="bg-gradient-to-r from-primary/10 to-purple-50 rounded-2xl p-6 border-2 border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-dark">Ready to Send</h3>
                            <p className="text-sm text-gray">
                                This email will be sent to <strong>{getRecipientCount()}</strong> recipient(s)
                            </p>
                        </div>
                        <FaEnvelope className="text-4xl text-primary/30" />
                    </div>

                    <button
                        type="submit"
                        disabled={sending || getRecipientCount() === 0}
                        className="w-full px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                    >
                        {sending ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Sending Email...
                            </>
                        ) : (
                            <>
                                <FaPaperPlane />
                                Send Email to {getRecipientCount()} Recipient(s)
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComposeEmail;
