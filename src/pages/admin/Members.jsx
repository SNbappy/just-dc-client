import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUser, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: 'Member',
        department: '',
        batch: '',
        email: '',
        phone: '',
        bio: '',
        isActive: true,
        priority: 0,
        socialLinks: {
            facebook: '',
            linkedin: '',
            twitter: '',
        },
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/members');
            setMembers(response.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch members');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('social_')) {
            const socialKey = name.replace('social_', '');
            setFormData({
                ...formData,
                socialLinks: {
                    ...formData.socialLinks,
                    [socialKey]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                department: member.department,
                batch: member.batch,
                email: member.email || '',
                phone: member.phone || '',
                bio: member.bio || '',
                isActive: member.isActive,
                priority: member.priority || 0,
                socialLinks: member.socialLinks || {
                    facebook: '',
                    linkedin: '',
                    twitter: '',
                },
            });
            setImagePreview(member.image || '');
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                role: 'Member',
                department: '',
                batch: '',
                email: '',
                phone: '',
                bio: '',
                isActive: true,
                priority: 0,
                socialLinks: {
                    facebook: '',
                    linkedin: '',
                    twitter: '',
                },
            });
            setImagePreview('');
        }
        setImageFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMember(null);
        setImageFile(null);
        setImagePreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submitData = new FormData();

            // Append all fields
            Object.keys(formData).forEach((key) => {
                if (key === 'socialLinks') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // Append image if selected
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (editingMember) {
                await api.put(`/members/${editingMember._id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Member updated successfully');
            } else {
                await api.post('/members', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Member added successfully');
            }

            fetchMembers();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save member');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            try {
                await api.delete(`/members/${id}`);
                toast.success('Member deleted successfully');
                fetchMembers();
            } catch (error) {
                toast.error('Failed to delete member');
                console.error(error);
            }
        }
    };

    const roleOrder = {
        'President': 1,
        'Vice President': 2,
        'General Secretary': 3,
        'Treasurer': 4,
        'Executive Member': 5,
        'Member': 6,
    };

    const sortedMembers = [...members].sort((a, b) => {
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
    });

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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-dark">Members Management</h1>
                    <p className="text-gray mt-1">Manage club members and executive committee</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                    <FaPlus />
                    Add Member
                </button>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedMembers.map((member) => (
                    <div
                        key={member._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {/* Member Image */}
                        <div className="relative h-48 bg-gradient-to-br from-primary to-secondary">
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaUser className="text-6xl text-white opacity-50" />
                                </div>
                            )}

                            {/* Status Badge */}
                            {!member.isActive && (
                                <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                        Inactive
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Member Info */}
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-dark mb-1">{member.name}</h3>
                            <p className="text-primary text-sm font-semibold mb-2">{member.role}</p>
                            <p className="text-gray text-sm mb-1">{member.department}</p>
                            <p className="text-gray text-sm mb-3">Batch: {member.batch}</p>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(member)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(member._id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
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
            {members.length === 0 && (
                <div className="text-center py-12">
                    <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-dark mb-2">No Members Yet</h3>
                    <p className="text-gray mb-4">Start by adding your first member!</p>
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        Add First Member
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-dark">
                                {editingMember ? 'Edit Member' : 'Add New Member'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-dark transition-colors"
                            >
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Image Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Member Photo
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-4xl text-gray-400" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Role *
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="President">President</option>
                                        <option value="Vice President">Vice President</option>
                                        <option value="General Secretary">General Secretary</option>
                                        <option value="Treasurer">Treasurer</option>
                                        <option value="Executive Member">Executive Member</option>
                                        <option value="Member">Member</option>
                                    </select>
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Department *
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., CSE, EEE, Civil"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* Batch */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Batch *
                                    </label>
                                    <input
                                        type="text"
                                        name="batch"
                                        value={formData.batch}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., 2020-21"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Priority (for sorting)
                                    </label>
                                    <input
                                        type="number"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="ml-2 text-sm font-semibold text-dark">
                                            Active Member
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows="3"
                                    maxLength="500"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Short bio about the member..."
                                />
                            </div>

                            {/* Social Links */}
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Social Links (Optional)
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="url"
                                        name="social_facebook"
                                        value={formData.socialLinks.facebook}
                                        onChange={handleInputChange}
                                        placeholder="Facebook Profile URL"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    <input
                                        type="url"
                                        name="social_linkedin"
                                        value={formData.socialLinks.linkedin}
                                        onChange={handleInputChange}
                                        placeholder="LinkedIn Profile URL"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    <input
                                        type="url"
                                        name="social_twitter"
                                        value={formData.socialLinks.twitter}
                                        onChange={handleInputChange}
                                        placeholder="Twitter Profile URL"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-semibold"
                                >
                                    {editingMember ? 'Update Member' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;
