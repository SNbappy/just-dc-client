// src/components/events/EventFormModal.jsx
import { useState } from 'react';
import { FaTimes, FaList, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import CategoryModal from './CategoryModal';
import ParticipantsSection from './ParticipantsSection';

const EventFormModal = ({ show, onClose, initialData, isEditing, onSubmit }) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(initialData.image || '');

    // Category modal state
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        type: 'individual',
        price: 0,
        capacity: '',
        accessType: 'all',
        teamMin: 2,
        teamMax: 4,
    });

    if (!show) return null;

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        if (formData.categories.length === 0) {
            newErrors.categories = 'At least one registration category is required';
        }

        return newErrors;
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size should not exceed 10MB');
            return;
        }

        setUploadingImage(true);

        try {
            const formDataImg = new FormData();
            formDataImg.append('image', file);
            formDataImg.append('folder', 'just-dc/events');

            const response = await api.post('/upload', formDataImg, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imageUrl = response?.data?.data?.url;
            if (!imageUrl) throw new Error('Upload response missing url');

            setFormData((prev) => ({ ...prev, image: imageUrl }));
            setImagePreview(imageUrl);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: '' }));
        setImagePreview('');
    };

    // Category Modal Functions
    const openCategoryModal = (index = null) => {
        if (index !== null) {
            setEditingCategoryIndex(index);
            const cat = formData.categories[index];
            setCategoryFormData({
                name: cat.name || '',
                type: cat.type || 'individual',
                price: cat.price || 0,
                capacity: cat.capacity || '',
                accessType: cat.accessType || 'all',
                teamMin: cat.teamMin || 2,
                teamMax: cat.teamMax || 4,
            });
        } else {
            setEditingCategoryIndex(null);
            setCategoryFormData({
                name: '',
                type: 'individual',
                price: 0,
                capacity: '',
                accessType: 'all',
                teamMin: 2,
                teamMax: 4,
            });
        }
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setEditingCategoryIndex(null);
    };

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData((prev) => ({
            ...prev,
            [name]:
                name === 'price' || name === 'capacity' || name === 'teamMin' || name === 'teamMax'
                    ? Number(value) || ''
                    : value,
        }));
    };

    const saveCategoryHandler = () => {
        if (!categoryFormData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        const categoryData = {
            name: categoryFormData.name.trim(),
            type: categoryFormData.type,
            price: Number(categoryFormData.price) || 0,
            capacity: Number(categoryFormData.capacity) || null,
            accessType: categoryFormData.accessType,
        };

        if (categoryData.type === 'team') {
            categoryData.teamMin = Number(categoryFormData.teamMin) || 2;
            categoryData.teamMax = Number(categoryFormData.teamMax) || 4;
        }

        const categories = [...formData.categories];
        if (editingCategoryIndex !== null) {
            categories[editingCategoryIndex] = categoryData;
            toast.success('Category updated');
        } else {
            categories.push(categoryData);
            toast.success('Category added');
        }

        setFormData((prev) => ({ ...prev, categories }));
        closeCategoryModal();
    };

    const deleteCategory = (index) => {
        if (window.confirm('Remove this category?')) {
            const categories = [...formData.categories];
            categories.splice(index, 1);
            setFormData((prev) => ({ ...prev, categories }));
            toast.success('Category removed');
        }
    };

    // Handle participants change
    const handleParticipantsChange = (newParticipants) => {
        setFormData((prev) => ({ ...prev, participants: newParticipants }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clean participants
        const cleanedParticipants = (formData.participants || []).map((p) => {
            if (p.type === 'internal') {
                return { role: p.role, type: 'internal', userId: p.userId };
            }
            return {
                role: p.role,
                type: 'external',
                name: (p.name || '').trim(),
                designation: (p.designation || '').trim(),
                org: (p.org || '').trim(),
            };
        });

        const payload = {
            ...formData,
            participants: cleanedParticipants,
        };

        try {
            await onSubmit(payload);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error saving event');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                    <h2 className="font-heading font-bold text-2xl text-dark">
                        {isEditing ? 'Edit Event' : 'Create New Event'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-dark transition-colors">
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.title ? 'border-red-500' : 'border-gray-200'
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
                            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.description ? 'border-red-500' : 'border-gray-200'
                                } focus:border-primary focus:outline-none`}
                            placeholder="Enter event description"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
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
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.date ? 'border-red-500' : 'border-gray-200'
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
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.time ? 'border-red-500' : 'border-gray-200'
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
                            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.location ? 'border-red-500' : 'border-gray-200'
                                } focus:border-primary focus:outline-none`}
                            placeholder="Enter event location"
                        />
                        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
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
                            <label className="block text-sm font-semibold text-dark mb-2">Max Participants</label>
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
                        <p className="text-xs text-gray mt-2">Max file size: 10MB. Supports: JPG, PNG, WEBP</p>
                    </div>

                    {/* Registration Categories Section */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-dark flex items-center gap-2">
                                    <FaList />
                                    Registration Categories *
                                </h3>
                                <p className="text-sm text-gray mt-1">
                                    Define registration types like Debater, Adjudicator, Speaker, etc.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => openCategoryModal()}
                                className="px-4 py-2 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary-dark"
                            >
                                <FaPlus />
                                Add Category
                            </button>
                        </div>

                        {errors.categories && <p className="mb-3 text-sm text-red-500">{errors.categories}</p>}

                        {/* Categories List */}
                        {formData.categories.length === 0 ? (
                            <div className="bg-gray-50 rounded-xl p-6 text-center">
                                <FaList className="text-4xl text-gray-300 mx-auto mb-2" />
                                <p className="text-gray text-sm">No registration categories yet. Add at least one.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {formData.categories.map((cat, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 rounded-xl p-4 flex items-start justify-between hover:bg-gray-100 transition"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-bold text-dark text-lg">{cat.name}</h4>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.type === 'team'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    {cat.type === 'team' ? 'Team' : 'Individual'}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.price === 0
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {cat.price === 0 ? 'Free' : `${cat.price}৳`}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray">
                                                <div>
                                                    <span className="font-semibold">Access:</span>{' '}
                                                    {cat.accessType === 'members_only'
                                                        ? 'Members Only'
                                                        : cat.accessType === 'registered_only'
                                                            ? 'Registered Users'
                                                            : 'Everyone'}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Capacity:</span>{' '}
                                                    {cat.capacity || 'Unlimited'}
                                                </div>
                                                {cat.type === 'team' && (
                                                    <div className="col-span-2">
                                                        <span className="font-semibold">Team Size:</span>{' '}
                                                        {cat.teamMin}-{cat.teamMax} members
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <button
                                                type="button"
                                                onClick={() => openCategoryModal(idx)}
                                                className="text-blue-600 hover:text-blue-800 p-2"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteCategory(idx)}
                                                className="text-red-600 hover:text-red-800 p-2"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Participants Section */}
                    <ParticipantsSection
                        participants={formData.participants}
                        onChange={handleParticipantsChange}
                    />

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                        >
                            {isEditing ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Category Modal */}
            <CategoryModal
                show={showCategoryModal}
                onClose={closeCategoryModal}
                formData={categoryFormData}
                onChange={handleCategoryChange}
                onSave={saveCategoryHandler}
                isEditing={editingCategoryIndex !== null}
            />
        </div>
    );
};

// ✅ THIS IS THE IMPORTANT LINE - MAKE SURE IT EXISTS!
export default EventFormModal;
