// pages/admin/EmailLogs.jsx
import { useState, useEffect } from 'react';
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaEye, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EmailLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/emails/logs');
            setLogs(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('Failed to load email logs');
        } finally {
            setLoading(false);
        }
    };

    const viewLog = async (logId) => {
        try {
            const res = await api.get(`/emails/logs/${logId}`);
            setSelectedLog(res.data?.data || null);
            setShowModal(true);
        } catch (error) {
            toast.error('Failed to load email details');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLog(null);
    };

    const getRecipientTypeLabel = (type) => {
        const labels = {
            all: 'All Members',
            role: 'By Role',
            individual: 'Individual',
            event: 'Event Participants',
            custom: 'Custom List',
        };
        return labels[type] || type;
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-3xl text-dark">Email History</h1>
                    <p className="text-gray mt-1">View all sent emails and their status</p>
                </div>
                <Link
                    to="/dashboard/manage/compose-email"
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold"
                >
                    Compose Email
                </Link>
            </div>

            {logs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <FaEnvelope className="mx-auto text-6xl text-gray-300 mb-4" />
                    <p className="text-gray text-lg mb-4">No emails sent yet</p>
                    <Link
                        to="/dashboard/manage/compose-email"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold"
                    >
                        Send Your First Email
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Subject</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Recipients</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Sent By</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray">
                                            {new Date(log.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-dark line-clamp-1">{log.subject}</p>
                                            <p className="text-xs text-gray">
                                                {getRecipientTypeLabel(log.recipientType)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray">
                                            <span className="font-semibold text-primary">{log.emailsSent}</span> sent
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray">
                                            {log.sender?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.status === 'sent' ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    <FaCheckCircle />
                                                    Sent
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                                    <FaTimesCircle />
                                                    Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => viewLog(log.id)}
                                                className="px-3 py-1 bg-gray-100 text-dark rounded-lg text-sm font-semibold hover:bg-gray-200 inline-flex items-center gap-2"
                                            >
                                                <FaEye />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Email Details Modal */}
            {showModal && selectedLog && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="text-2xl font-bold text-dark">Email Details</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-dark">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray mb-1">Sent By</p>
                                    <p className="font-semibold text-dark">
                                        {selectedLog.sender?.name || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray">{selectedLog.sender?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray mb-1">Date</p>
                                    <p className="font-semibold text-dark">
                                        {new Date(selectedLog.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray mb-1">Recipient Type</p>
                                    <p className="font-semibold text-dark">
                                        {getRecipientTypeLabel(selectedLog.recipientType)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray mb-1">Emails Sent</p>
                                    <p className="font-semibold text-primary">{selectedLog.emailsSent}</p>
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <p className="text-sm text-gray mb-2">Subject</p>
                                <p className="font-semibold text-dark text-lg">{selectedLog.subject}</p>
                            </div>

                            {/* Message */}
                            <div>
                                <p className="text-sm text-gray mb-2">Message</p>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <p className="text-dark whitespace-pre-wrap">{selectedLog.message}</p>
                                </div>
                            </div>

                            {/* Recipients */}
                            <div>
                                <p className="text-sm text-gray mb-2">
                                    Recipients ({selectedLog.recipients?.length || 0})
                                </p>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-60 overflow-y-auto">
                                    {selectedLog.recipients && selectedLog.recipients.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedLog.recipients.map((recipient, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 text-sm text-gray"
                                                >
                                                    <FaEnvelope className="text-primary flex-shrink-0" />
                                                    <span>{recipient.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray text-sm">No recipients</p>
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {selectedLog.errorMessage && (
                                <div>
                                    <p className="text-sm text-gray mb-2">Error Details</p>
                                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                        <p className="text-red-700 text-sm">{selectedLog.errorMessage}</p>
                                    </div>
                                </div>
                            )}

                            {/* HTML Preview */}
                            {selectedLog.htmlContent && (
                                <div>
                                    <p className="text-sm text-gray mb-2">Email Preview</p>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">
                                        <div dangerouslySetInnerHTML={{ __html: selectedLog.htmlContent }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t">
                            <button
                                onClick={closeModal}
                                className="w-full px-6 py-3 bg-gray-100 text-dark rounded-xl font-semibold hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailLogs;
