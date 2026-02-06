// src/pages/TrackRegistration.jsx
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import toast from 'react-hot-toast';
import { FaSearch, FaCheckCircle, FaClock, FaTimesCircle, FaTicketAlt, FaCalendar, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const TrackRegistration = () => {
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token');

    const [token, setToken] = useState(tokenFromUrl || '');
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();

        if (!token.trim()) {
            toast.error('Please enter your verification token');
            return;
        }

        setLoading(true);

        try {
            const res = await registrationService.trackRegistration(token);
            setRegistration(res.data);
            toast.success('Registration found!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration not found');
            setRegistration(null);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <FaCheckCircle className="text-success text-2xl" />;
            case 'pending_payment':
                return <FaClock className="text-warning text-2xl" />;
            case 'cancelled':
                return <FaTimesCircle className="text-error text-2xl" />;
            default:
                return <FaClock className="text-gray text-2xl" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmed';
            case 'pending_payment':
                return 'Pending Payment';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-success/10 text-success border-success/20';
            case 'pending_payment':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'cancelled':
                return 'bg-error/10 text-error border-error/20';
            default:
                return 'bg-gray/10 text-gray border-gray/20';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
                        <FaTicketAlt className="text-3xl text-white" />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-dark mb-2">Track Registration</h1>
                    <p className="text-gray">
                        Enter your verification token to track your registration status
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-md p-6 mb-6">
                    <label className="block text-sm font-semibold text-dark mb-2">
                        Verification Token
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Enter your token (from email)"
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <FaSearch />
                            {loading ? 'Searching...' : 'Track'}
                        </button>
                    </div>
                    <p className="text-xs text-gray mt-2">
                        * Check your email for the verification token sent after registration
                    </p>
                </form>

                {/* Registration Details */}
                {registration && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        {/* Status Badge */}
                        <div className={`flex items-center justify-between mb-6 pb-4 border-b-2 ${getStatusColor(registration.status)} border-2 rounded-xl p-4`}>
                            <div>
                                <p className="text-sm font-medium mb-1">Registration Status</p>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(registration.status)}
                                    <span className="text-xl font-bold">{getStatusText(registration.status)}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray">Registration ID</p>
                                <p className="font-mono font-semibold text-dark">{registration.registrationId}</p>
                            </div>
                        </div>

                        {/* Event Info */}
                        <div className="mb-6">
                            <h3 className="font-heading font-bold text-lg text-dark mb-3 flex items-center gap-2">
                                <FaCalendar className="text-primary" />
                                Event Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray mb-1">Event</p>
                                    <p className="font-semibold text-dark">{registration.event?.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray mb-1">Date</p>
                                    <p className="font-semibold text-dark">
                                        {new Date(registration.event?.startDate || registration.event?.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray mb-1 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-primary" />
                                        Venue
                                    </p>
                                    <p className="font-semibold text-dark">{registration.event?.venue || registration.event?.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray mb-1">Category</p>
                                    <p className="font-semibold text-dark">{registration.categoryName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray mb-1">Type</p>
                                    <p className="font-semibold text-dark capitalize">{registration.registrationType}</p>
                                </div>
                            </div>
                        </div>

                        {/* Participant Info */}
                        <div className="mb-6">
                            <h3 className="font-heading font-bold text-lg text-dark mb-3 flex items-center gap-2">
                                <FaUser className="text-primary" />
                                Participant Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray mb-1">Name</p>
                                    <p className="font-semibold text-dark">{registration.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray mb-1 flex items-center gap-1">
                                        <FaEnvelope className="text-primary" />
                                        Email
                                    </p>
                                    <p className="font-semibold text-dark">{registration.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray mb-1 flex items-center gap-1">
                                        <FaPhone className="text-primary" />
                                        Phone
                                    </p>
                                    <p className="font-semibold text-dark">{registration.phone}</p>
                                </div>
                                {registration.organization && (
                                    <div>
                                        <p className="text-sm text-gray mb-1">Organization</p>
                                        <p className="font-semibold text-dark">{registration.organization}</p>
                                    </div>
                                )}
                                {registration.teamName && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray mb-1 flex items-center gap-1">
                                            <FaUsers className="text-primary" />
                                            Team Name
                                        </p>
                                        <p className="font-semibold text-dark">{registration.teamName}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Team Members */}
                        {registration.teamMembers && registration.teamMembers.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-heading font-bold text-lg text-dark mb-3 flex items-center gap-2">
                                    <FaUsers className="text-primary" />
                                    Team Members
                                </h3>
                                <div className="space-y-3">
                                    {registration.teamMembers.map((member, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <p className="font-semibold text-dark mb-2">Member {index + 1}</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray">Name:</span>
                                                    <span className="ml-2 text-dark font-medium">{member.name}</span>
                                                </div>
                                                {member.email && (
                                                    <div>
                                                        <span className="text-gray">Email:</span>
                                                        <span className="ml-2 text-dark font-medium">{member.email}</span>
                                                    </div>
                                                )}
                                                {member.phone && (
                                                    <div>
                                                        <span className="text-gray">Phone:</span>
                                                        <span className="ml-2 text-dark font-medium">{member.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Info */}
                        {registration.payment && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-100">
                                <h3 className="font-heading font-bold text-lg text-dark mb-3 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-primary" />
                                    Payment Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray mb-1">Amount</p>
                                        <p className="font-bold text-2xl text-primary">
                                            ৳{registration.payment.amount}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray mb-1">Status</p>
                                        <p className="font-semibold text-dark capitalize">
                                            {registration.payment.status}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray mb-1">Transaction ID</p>
                                        <p className="font-mono font-semibold text-dark">
                                            {registration.payment.transactionId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-6 pt-6 border-t flex gap-3">
                            <Link
                                to={`/events/${registration.eventId}`}
                                className="flex-1 text-center px-6 py-3 bg-gray-100 text-dark rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                View Event
                            </Link>
                            {registration.status === 'confirmed' && (
                                <button className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">
                                    Download Receipt
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray mb-2">
                        Can't find your token? Check your email or contact support.
                    </p>
                    <Link to="/contact" className="text-primary font-semibold hover:underline">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TrackRegistration;
