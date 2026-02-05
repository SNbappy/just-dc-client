import { useState, useEffect } from "react";
import { getMyPayments, initiateSSLPayment } from "../services/paymentService";
import toast from "react-hot-toast";
import {
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaMoneyBillWave,
    FaMobileAlt,
} from "react-icons/fa";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentType, setPaymentType] = useState("");
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await getMyPayments();
            // backend returns: { success, count, data }
            setPayments(response?.data || []);
        } catch (error) {
            toast.error("Failed to fetch payments");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    };

    const openPaymentModal = (type) => {
        setPaymentType(type);
        setShowPaymentModal(true);
    };

    const handlePayNow = async (type, amount, month = null) => {
        setProcessingPayment(true);
        try {
            const payload = {
                amount,
                type,
                month: type === "monthly" ? month : undefined,
            };

            const response = await initiateSSLPayment(payload);

            if (response?.success && response?.data?.paymentUrl) {
                // Redirect user to SSLCommerz
                window.location.href = response.data.paymentUrl;
                return;
            }

            toast.error("Payment initiation failed (no paymentUrl returned)");
            console.error("initiateSSLPayment response:", response);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Payment failed");
            console.error(error);
        } finally {
            setProcessingPayment(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            paid: { color: "bg-green-100 text-green-700", icon: FaCheckCircle, text: "Paid" },
            pending: { color: "bg-yellow-100 text-yellow-700", icon: FaClock, text: "Pending" },
            failed: { color: "bg-red-100 text-red-700", icon: FaTimesCircle, text: "Failed" },
            overdue: { color: "bg-orange-100 text-orange-700", icon: FaClock, text: "Overdue" },
            refunded: { color: "bg-gray-100 text-gray-700", icon: FaTimesCircle, text: "Refunded" },
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                <Icon className="text-xs" />
                {badge.text}
            </span>
        );
    };

    const hasRegistrationPayment = payments.some(
        (p) => p.type === "registration" && p.status === "paid"
    );

    const currentMonth = getCurrentMonth();
    const currentMonthPayment = payments.find(
        (p) => p.type === "monthly" && p.month === currentMonth && p.status === "paid"
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Registration Fee Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-dark">Registration Fee</h3>
                            <p className="text-2xl font-bold text-primary mt-1">৳150</p>
                        </div>
                        <FaMoneyBillWave className="text-4xl text-primary opacity-20" />
                    </div>

                    {hasRegistrationPayment ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <FaCheckCircle />
                            <span className="font-medium">Paid</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => openPaymentModal("registration")}
                            className="btn-primary w-full"
                            disabled={processingPayment}
                        >
                            <FaMobileAlt className="mr-2" />
                            Pay Now
                        </button>
                    )}
                </div>

                {/* Monthly Fee Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-secondary">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-dark">Monthly Fee</h3>
                            <p className="text-2xl font-bold text-secondary mt-1">৳30</p>
                        </div>
                        <FaMoneyBillWave className="text-4xl text-secondary opacity-20" />
                    </div>

                    {currentMonthPayment ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <FaCheckCircle />
                            <span className="font-medium">Paid for {currentMonthPayment.month}</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => openPaymentModal("monthly")}
                            className="btn-secondary w-full"
                            disabled={processingPayment}
                        >
                            <FaMobileAlt className="mr-2" />
                            Pay Now
                        </button>
                    )}
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-dark mb-6">Payment History</h2>

                {payments.length === 0 ? (
                    <div className="text-center py-12">
                        <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No payment history yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-dark">Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark">Type</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark">Amount</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark">Method</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark">Transaction ID</th>
                                    <th className="text-left py-3 px-4 font-semibold text-dark">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id ?? payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="py-3 px-4 capitalize">
                                            {payment.type}
                                            {payment.month && (
                                                <span className="text-sm text-gray ml-2">({payment.month})</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 font-semibold">৳{payment.amount}</td>
                                        <td className="py-3 px-4 capitalize">{payment.paymentMethod || "-"}</td>
                                        <td className="py-3 px-4 text-sm text-gray">
                                            {payment.transactionId || "Pending"}
                                        </td>
                                        <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-dark mb-4">
                            {paymentType === "registration" ? "Registration Fee Payment" : "Monthly Fee Payment"}
                        </h3>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray">Amount:</span>
                                <span className="text-2xl font-bold text-primary">
                                    ৳{paymentType === "registration" ? "150" : "30"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray">Payment Method:</span>
                                <span className="font-medium">SSLCommerz (bKash, Nagad, Rocket, Cards)</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <p className="text-sm text-blue-700">
                                You will be redirected to SSLCommerz secure payment gateway. You can pay using
                                bKash, Nagad, Rocket, or any credit/debit card.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() =>
                                    handlePayNow(
                                        paymentType,
                                        paymentType === "registration" ? 150 : 30,
                                        paymentType === "monthly" ? currentMonth : null
                                    )
                                }
                                className="btn-primary w-full flex items-center justify-center gap-2"
                                disabled={processingPayment}
                            >
                                {processingPayment ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaMobileAlt />
                                        Proceed to Payment
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="btn-outline w-full"
                                disabled={processingPayment}
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

export default Payments;
