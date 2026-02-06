// src/pages/dashboard/MyRegistrations.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import toast from 'react-hot-toast';
import { FaTicketAlt, FaCalendar, FaMapMarkerAlt, FaCheckCircle, FaClock, FaTimesCircle, FaEye, FaTrash } from 'react-icons/fa';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, confirmed, pending_payment, cancelled

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const res = await registrationService.getMyRegistrations();
            setRegistrations(res.data);
        } catch (error) {
            toast.error('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (registrationId) => {
        if (!window.confirm('Are you sure you want to cancel this registration?')) {
            return;
        }

        try {
            await registrationService.cancelRegistration(registrationId);
            toast.success('Registration cancelled');
            fetchRegistrations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel registration');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <FaCheckCircle className="text-success" />;
            case 'pending_payment':
                return <FaClock className="text-warning" />;
            case 'cancelled':
                return <FaTimesCircle className="text-error" />;
            default:
                return <FaClock className="text-gray" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-success/10 text-success';
            case 'pending_payment':
                return 'bg-warning/10 text-warning';
            case 'cancelled':
                return 'bg-error/10 text-error';
            default:
                return 'bg-gray/10 text-gray';
        }
    };

    const filteredRegistrations = registrations.filter((reg) => {
        if (filter === 'all') return true;
        return reg.status === filter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-dark mb-1">My Registrations</h1>
                        <p className="text-gray">View and manage your event registrations</p>
                    </div>
                    <Link
                        to="/events"
                        className="px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                    >
                        Browse Events
                    </Link>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'confirmed', label: 'Confirmed' },
                        { key: 'pending_payment', label: 'Pending' },
                        { key: 'cancelled', label: 'Cancelled' },
                    ].map((btn) => (
                        <button
                            key={btn.key}
                            onClick={() => setFilter(btn.key)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === btn.key
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray hover:bg-gray-200'
                                }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Registrations List */}
            {filteredRegistrations.length > 0 ? (
                <div className="grid gap-6">
                    {filteredRegistrations.map((registration) => (
                        <div
                            key={registration.id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="md:flex">
                                {/* Event Image */}
                                <div className="md:w-48 h-48 bg-gradient-to-br from-primary to-secondary">
                                    {registration.event?.coverImage || registration.event?.image ? (
                                        <img
                                            src={registration.event?.coverImage || registration.event?.image}
                                            alt={registration.event?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaTicketAlt className="text-6xl text-white opacity-50" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-heading font-bold text-xl text-dark mb-1">
                                                {registration.event?.title}
                                            </h3>
                                            <p className="text-sm text-gray">{registration.categoryName}</p>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(registration.status)}`}>
                                            {getStatusIcon(registration.status)}
                                            <span className="capitalize">{registration.status.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-gray text-sm">
                                            <FaCalendar className="text-primary" />
                                            <span>
                                                {new Date(registration.event?.startDate || registration.event?.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray text-sm">
                                            <FaMapMarkerAlt className="text-primary" />
                                            <span className="line-clamp-1">{registration.event?.venue || registration.event?.location}</span>
                                        </div>
                                        {registration.teamName && (
                                            <div className="md:col-span-2">
                                                <span className="text-sm text-gray">Team: </span>
                                                <span className="text-sm font-semibold text-dark">{registration.teamName}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Info */}
                                    {registration.payment && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray">Amount:</span>
                                                <span className="font-bold text-primary">৳{registration.payment.amount}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm mt-1">
                                                <span className="text-gray">Payment Status:</span>
                                                <span className="font-semibold text-dark capitalize">{registration.payment.status}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/events/${registration.eventId}`}
                                            className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaEye />
                                            View Event
                                        </Link>
                                        {registration.status === 'pending_payment' && (
                                            <button
                                                onClick={() => handleCancel(registration.id)}
                                                className="px-4 py-2 bg-error text-white rounded-lg font-semibold hover:bg-error/90 transition-colors flex items-center gap-2"
                                            >
                                                <FaTrash />
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-2xl text-dark mb-2">
                        No {filter !== 'all' && filter} registrations found
                    </h3>
                    <p className="text-gray mb-6">
                        {filter === 'all'
                            ? 'You haven\'t registered for any events yet.'
                            : `You have no ${filter} registrations.`}
                    </p>
                    <Link
                        to="/events"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                    >
                        Browse Events
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
