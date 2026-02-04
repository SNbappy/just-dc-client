import { useState, useEffect } from 'react';
import {
    getAllPayments,
    verifyPayment,
    getPaymentStats,
    generateMonthlyPayments,
} from '../../services/paymentService';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaUsers, FaClock } from 'react-icons/fa';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: '', status: '' });
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [verifyStatus, setVerifyStatus] = useState('paid');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paymentsRes, statsRes] = await Promise.all([
                getAllPayments(filter),
                getPaymentStats(),
            ]);
            setPayments(paymentsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            await verifyPayment(selectedPayment._id, { status: verifyStatus, notes });
            toast.success(`Payment ${verifyStatus === 'paid' ? 'verified' : 'rejected'} successfully`);
            setShowVerifyModal(false);
            setSelectedPayment(null);
            setNotes('');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to verify payment');
        }
    };

    const handleGenerateMonthly = async () => {
        const month = new Date().toISOString().slice(0, 7);
        const confirm = window.confirm(`Generate monthly payments for ${month}?`);

        if (confirm) {
            try {
                const response = await generateMonthlyPayments(month);
                toast.success(`Generated ${response.data.created} monthly payments`);
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to generate payments');
            }
        }
    };

    const openVerifyModal = (payment) => {
        setSelectedPayment(payment);
        setShowVerifyModal(true);
    };

    const getStatusBadge = (status) => {
        const badges = {
            paid: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            failed: 'bg-red-100 text-red-700',
            overdue: 'bg-orange-100 text-orange-700',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status] || badges.pending}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-dark">Payment Management</h1>
                <button onClick={handleGenerateMonthly} className="btn-primary">
                    Generate Monthly Payments
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-dark mt-1">৳{stats.totalRevenue}</p>
                            </div>
                            <FaMoneyBillWave className="text-3xl text-primary opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray text-sm">Pending Payments</p>
                                <p className="text-2xl font-bold text-dark mt-1">{stats.pendingPayments}</p>
                            </div>
                            <FaClock className="text-3xl text-yellow-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray text-sm">Paid This Month</p>
                                <p className="text-2xl font-bold text-dark mt-1">{stats.paidThisMonth}</p>
                            </div>
                            <FaCheckCircle className="text-3xl text-green-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray text-sm">Registration Revenue</p>
                                <p className="text-2xl font-bold text-dark mt-1">৳{stats.registrationRevenue}</p>
                            </div>
                            <FaUsers className="text-3xl text-secondary opacity-20" />
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Payment Type</label>
                        <select
                            value={filter.type}
                            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">All Types</option>
                            <option value="registration">Registration</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Status</label>
                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilter({ type: '', status: '' })}
                            className="btn-outline w-full"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-dark">User</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Type</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Amount</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Method</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Transaction ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-medium text-dark">{payment.user?.name}</p>
                                            <p className="text-sm text-gray">{payment.user?.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 capitalize">
                                        {payment.type}
                                        {payment.month && <div className="text-sm text-gray">{payment.month}</div>}
                                    </td>
                                    <td className="py-4 px-6 font-semibold">৳{payment.amount}</td>
                                    <td className="py-4 px-6 capitalize">{payment.paymentMethod || '-'}</td>
                                    <td className="py-4 px-6 text-sm">{payment.transactionId || 'N/A'}</td>
                                    <td className="py-4 px-6">{getStatusBadge(payment.status)}</td>
                                    <td className="py-4 px-6 text-sm">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6">
                                        {payment.status === 'pending' && (
                                            <button
                                                onClick={() => openVerifyModal(payment)}
                                                className="text-primary hover:text-primary-dark font-medium"
                                            >
                                                Verify
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {payments.length === 0 && (
                        <div className="text-center py-12">
                            <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No payments found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Verify Modal */}
            {showVerifyModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-dark mb-4">Verify Payment</h3>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray mb-1">User</p>
                            <p className="font-medium text-dark mb-3">{selectedPayment.user?.name}</p>

                            <p className="text-sm text-gray mb-1">Amount</p>
                            <p className="font-bold text-primary text-xl mb-3">৳{selectedPayment.amount}</p>

                            <p className="text-sm text-gray mb-1">Transaction ID</p>
                            <p className="font-medium text-dark">{selectedPayment.transactionId || 'N/A'}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-dark mb-2">Action</label>
                            <select
                                value={verifyStatus}
                                onChange={(e) => setVerifyStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                            >
                                <option value="paid">Approve Payment</option>
                                <option value="failed">Reject Payment</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-dark mb-2">Notes (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                rows="3"
                                placeholder="Add verification notes..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleVerify} className="btn-primary flex-1">
                                {verifyStatus === 'paid' ? (
                                    <>
                                        <FaCheckCircle className="mr-2" />
                                        Approve
                                    </>
                                ) : (
                                    <>
                                        <FaTimesCircle className="mr-2" />
                                        Reject
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowVerifyModal(false);
                                    setSelectedPayment(null);
                                    setNotes('');
                                }}
                                className="btn-outline flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;
