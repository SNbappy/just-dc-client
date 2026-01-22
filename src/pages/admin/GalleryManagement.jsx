import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImages, FaTimes, FaEye } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const GalleryManagement = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [editingGallery, setEditingGallery] = useState(null);
    const [viewingGallery, setViewingGallery] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Event',
        eventDate: '',
        isPublished: true,
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            setLoading(true);
            const response = await api.get('/gallery');
            setGalleries(response.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch galleries');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        // Create previews
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const openModal = (gallery = null) => {
        if (gallery) {
            setEditingGallery(gallery);
            setFormData({
                title: gallery.title,
                description: gallery.description || '',
                category: gallery.category,
                eventDate: gallery.eventDate ? gallery.eventDate.split('T')[0] : '',
                isPublished: gallery.isPublished,
            });
        } else {
            setEditingGallery(null);
            setFormData({
                title: '',
                description: '',
                category: 'Event',
                eventDate: '',
                isPublished: true,
            });
        }
        setSelectedImages([]);
        setImagePreviews([]);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingGallery(null);
        setSelectedImages([]);
        setImagePreviews([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingGallery && selectedImages.length === 0) {
            toast.error('Please select at least one image');
            return;
        }

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                submitData.append(key, formData[key]);
            });

            selectedImages.forEach((image) => {
                submitData.append('images', image);
            });

            if (editingGallery) {
                await api.put(`/gallery/${editingGallery._id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Gallery updated successfully');
            } else {
                await api.post('/gallery', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Gallery created successfully');
            }

            fetchGalleries();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save gallery');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this gallery? All images will be permanently deleted.')) {
            try {
                await api.delete(`/gallery/${id}`);
                toast.success('Gallery deleted successfully');
                fetchGalleries();
            } catch (error) {
                toast.error('Failed to delete gallery');
                console.error(error);
            }
        }
    };

    const handleDeleteImage = async (galleryId, imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await api.delete(`/gallery/${galleryId}/image/${imageId}`);
                toast.success('Image deleted successfully');

                // Update viewing gallery if open
                if (viewingGallery && viewingGallery._id === galleryId) {
                    const response = await api.get(`/gallery/${galleryId}`);
                    setViewingGallery(response.data.data);
                }

                fetchGalleries();
            } catch (error) {
                toast.error('Failed to delete image');
                console.error(error);
            }
        }
    };

    const openViewModal = (gallery) => {
        setViewingGallery(gallery);
        setViewModal(true);
    };

    const closeViewModal = () => {
        setViewModal(false);
        setViewingGallery(null);
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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-dark">Gallery Management</h1>
                    <p className="text-gray mt-1">Manage photo albums and event galleries</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                    <FaPlus />
                    Create Album
                </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                    <div
                        key={gallery._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {/* Album Cover */}
                        <div className="relative h-56 bg-gradient-to-br from-primary to-secondary">
                            {gallery.images && gallery.images.length > 0 ? (
                                <img
                                    src={gallery.images[0].url}
                                    alt={gallery.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaImages className="text-6xl text-white opacity-50" />
                                </div>
                            )}

                            {/* Image Count Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-black bg-opacity-70 text-white text-sm rounded-full">
                                    {gallery.images?.length || 0} Photos
                                </span>
                            </div>

                            {/* Published Badge */}
                            {!gallery.isPublished && (
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                                        Draft
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Album Info */}
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-dark line-clamp-1">{gallery.title}</h3>
                                <span className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full">
                                    {gallery.category}
                                </span>
                            </div>

                            {gallery.description && (
                                <p className="text-gray text-sm mb-3 line-clamp-2">{gallery.description}</p>
                            )}

                            {gallery.eventDate && (
                                <p className="text-gray text-xs mb-3">
                                    {new Date(gallery.eventDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openViewModal(gallery)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                >
                                    <FaEye />
                                    View
                                </button>
                                <button
                                    onClick={() => openModal(gallery)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(gallery._id)}
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
            {galleries.length === 0 && (
                <div className="text-center py-12">
                    <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-dark mb-2">No Gallery Albums Yet</h3>
                    <p className="text-gray mb-4">Start by creating your first album!</p>
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        Create First Album
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-dark">
                                {editingGallery ? 'Edit Gallery' : 'Create New Album'}
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
                            {/* Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Album Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Inter-University Debate 2026"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Category & Event Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="Event">Event</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Competition">Competition</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Achievement">Achievement</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Event Date
                                    </label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    maxLength="500"
                                    placeholder="Brief description of the event..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Images Upload */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Upload Images {!editingGallery && '*'} (Max 10 images)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    required={!editingGallery}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                                />
                                <p className="text-xs text-gray mt-1">
                                    {editingGallery ? 'Upload additional images to this album' : 'Select multiple images for this album'}
                                </p>
                            </div>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Preview ({imagePreviews.length} images selected)
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative aspect-square">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Published Status */}
                            <div className="mb-6">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        checked={formData.isPublished}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm font-semibold text-dark">
                                        Publish this album (make it visible to public)
                                    </span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
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
                                    {editingGallery ? 'Update Album' : 'Create Album'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewModal && viewingGallery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-dark">{viewingGallery.title}</h2>
                                <p className="text-sm text-gray">{viewingGallery.images?.length || 0} Photos</p>
                            </div>
                            <button
                                onClick={closeViewModal}
                                className="text-gray-500 hover:text-dark transition-colors"
                            >
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Album Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                                        {viewingGallery.category}
                                    </span>
                                    {viewingGallery.eventDate && (
                                        <span className="text-sm text-gray">
                                            {new Date(viewingGallery.eventDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-sm ${viewingGallery.isPublished ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {viewingGallery.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                {viewingGallery.description && (
                                    <p className="text-gray mt-3">{viewingGallery.description}</p>
                                )}
                            </div>

                            {/* Images Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {viewingGallery.images?.map((image) => (
                                    <div key={image._id} className="relative group">
                                        <img
                                            src={image.url}
                                            alt={image.caption || 'Gallery image'}
                                            className="w-full aspect-square object-cover rounded-lg"
                                        />
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteImage(viewingGallery._id, image._id)}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {viewingGallery.images?.length === 0 && (
                                <div className="text-center py-12">
                                    <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray">No images in this album</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManagement;
