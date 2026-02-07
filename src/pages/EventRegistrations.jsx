// src/pages/EventRegistration.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registrationService } from '../services/registrationService';
import toast from 'react-hot-toast';
import { FaTicketAlt, FaUsers, FaUser, FaCreditCard, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';

const EventRegistration = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        studentId: user?.studentId || '',
        department: user?.department || '',
        batch: user?.batch || '',
        organization: '',
        teamName: '',
        teamMembers: [],
        customFields: {}
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await registrationService.getCategories(eventId);
                setEvent(res.data.event);
                setCategories(res.data.categories);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load registration');
                navigate(`/events/${eventId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [eventId, navigate]);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add team member
    const addTeamMember = () => {
        setFormData({
            ...formData,
            teamMembers: [
                ...formData.teamMembers,
                { name: '', email: '', phone: '', studentId: '' }
            ]
        });
    };

    // Update team member
    const updateTeamMember = (index, field, value) => {
        const updated = [...formData.teamMembers];
        updated[index][field] = value;
        setFormData({ ...formData, teamMembers: updated });
    };

    // Remove team member
    const removeTeamMember = (index) => {
        const updated = formData.teamMembers.filter((_, i) => i !== index);
        setFormData({ ...formData, teamMembers: updated });
    };

    // Submit registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory) {
            toast.error('Please select a category');
            return;
        }

        // Validation
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('Name, email, and phone are required');
            return;
        }

        if (selectedCategory.type === 'team' && !formData.teamName) {
            toast.error('Team name is required');
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                studentId: formData.studentId,
                department: formData.department,
                batch: formData.batch,
                organization: formData.organization,
                teamName: selectedCategory.type === 'team' ? formData.teamName : null,
                teamMembers: selectedCategory.type === 'team' ? formData.teamMembers : null,
                customFields: formData.customFields
            };

            const res = await registrationService.register(eventId, selectedCategory.id, payload);

            // ✅ HANDLE PAYMENT REDIRECT
            if (res.data?.payment?.gatewayUrl) {
                toast.success('Redirecting to payment gateway...');
                // Redirect to SSLCommerz
                window.location.href = res.data.payment.gatewayUrl;
            } else {
                // Free registration
                toast.success(res.message || 'Registration successful!');
                navigate('/dashboard/registrations');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    to={`/events/${eventId}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6 font-medium"
                >
                    <FaArrowLeft />
                    Back to Event
                </Link>

                {/* Event Header */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                    <h1 className="font-heading text-3xl font-bold text-dark mb-2">{event?.title}</h1>
                    <p className="text-gray">
                        {new Date(event?.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })} • {event?.location}
                    </p>
                </div>

                {/* Categories Selection */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                    <h2 className="font-heading text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                        <FaTicketAlt className="text-primary" />
                        Select Category
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => {
                                    if (category.hasAccess && category.isOpen && !category.isFull) {
                                        setSelectedCategory(category);
                                    }
                                }}
                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedCategory?.id === category.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 hover:border-primary/50'
                                    } ${!category.hasAccess || !category.isOpen || category.isFull
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-lg text-dark">{category.name}</h3>
                                    {category.type === 'team' ? (
                                        <FaUsers className="text-primary text-xl" />
                                    ) : (
                                        <FaUser className="text-primary text-xl" />
                                    )}
                                </div>

                                <p className="text-sm text-gray mb-3">{category.description}</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-primary">
                                        {category.pricing?.isFree ? (
                                            'Free'
                                        ) : (
                                            `৳${category.pricing?.amount}`
                                        )}
                                    </span>

                                    {category.capacity?.max > 0 && (
                                        <span className="text-sm text-gray">
                                            {category.capacity.current}/{category.capacity.max} slots
                                        </span>
                                    )}
                                </div>

                                {!category.hasAccess && (
                                    <p className="text-error text-sm mt-2">{category.accessMessage}</p>
                                )}

                                {!category.isOpen && (
                                    <p className="text-warning text-sm mt-2">Registration closed</p>
                                )}

                                {category.isFull && (
                                    <p className="text-error text-sm mt-2">Category full</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Registration Form */}
                {selectedCategory && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="font-heading text-2xl font-bold text-dark mb-6">Registration Details</h2>

                        {/* Personal Info */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Student ID
                                </label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Batch
                                </label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Organization
                                </label>
                                <input
                                    type="text"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Team Registration */}
                        {selectedCategory.type === 'team' && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                                <h3 className="font-heading text-lg font-bold text-dark mb-4">Team Information</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Team Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="teamName"
                                        value={formData.teamName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-semibold text-dark">
                                            Team Members
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addTeamMember}
                                            className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-semibold"
                                        >
                                            <FaPlus />
                                            Add Member
                                        </button>
                                    </div>

                                    {formData.teamMembers.map((member, index) => (
                                        <div key={index} className="bg-white p-4 rounded-xl mb-3 border-2 border-gray-200">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-semibold text-dark">
                                                    Member {index + 1}
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTeamMember(index)}
                                                    className="flex items-center gap-1 text-error text-sm hover:underline"
                                                >
                                                    <FaTrash />
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Name *"
                                                    value={member.name}
                                                    onChange={(e) =>
                                                        updateTeamMember(index, 'name', e.target.value)
                                                    }
                                                    className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    value={member.email}
                                                    onChange={(e) =>
                                                        updateTeamMember(index, 'email', e.target.value)
                                                    }
                                                    className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
                                                />
                                                <input
                                                    type="tel"
                                                    placeholder="Phone"
                                                    value={member.phone}
                                                    onChange={(e) =>
                                                        updateTeamMember(index, 'phone', e.target.value)
                                                    }
                                                    className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Student ID"
                                                    value={member.studentId}
                                                    onChange={(e) =>
                                                        updateTeamMember(index, 'studentId', e.target.value)
                                                    }
                                                    className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Info */}
                        {!selectedCategory.pricing?.isFree && (
                            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-xl mb-6 border border-primary/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FaCreditCard className="text-primary text-2xl" />
                                        <div>
                                            <p className="text-sm text-gray">Registration Fee</p>
                                            <p className="text-2xl font-bold text-dark">
                                                ৳{selectedCategory.pricing?.amount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray mb-1">Payment via</p>
                                        <p className="text-sm font-semibold text-dark">
                                            SSLCommerz
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                    Processing...
                                </span>
                            ) : selectedCategory.pricing?.isFree ? (
                                'Complete Registration'
                            ) : (
                                `Pay ৳${selectedCategory.pricing?.amount} & Register`
                            )}
                        </button>

                        <p className="text-xs text-gray text-center mt-4">
                            * You will receive a confirmation email after successful registration
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EventRegistration;
