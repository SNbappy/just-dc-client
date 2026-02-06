// src/pages/PaymentCancelled.jsx
import { Link, useSearchParams } from 'react-router-dom';
import { FaBan, FaRedo, FaHome } from 'react-icons/fa';

const PaymentCancelled = () => {
    const [searchParams] = useSearchParams();
    const transaction = searchParams.get('transaction');

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Cancel Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warning/20 mb-6">
                        <FaBan className="text-6xl text-warning" />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-dark mb-2">
                        Payment Cancelled
                    </h1>
                    <p className="text-gray text-lg">
                        You cancelled the payment process
                    </p>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-warning mb-1">Payment Cancelled</p>
                        <p className="text-sm text-gray">
                            No charges were made to your account.
                        </p>
                        {transaction && (
                            <p className="text-xs text-gray mt-2">
                                Transaction ID: <span className="font-mono">{transaction}</span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 text-sm text-gray">
                        <p>ℹ️ Your registration is still pending payment</p>
                        <p>💡 You can retry payment anytime from your dashboard</p>
                        <p>⏰ Payment must be completed before the event deadline</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => window.history.back()}
                        className="block w-full text-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                        <FaRedo />
                        Complete Payment
                    </button>
                    <Link
                        to="/dashboard/registrations"
                        className="block w-full text-center px-6 py-3 bg-white text-dark border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        View My Registrations
                    </Link>
                    <Link
                        to="/events"
                        className="block w-full text-center px-6 py-3 bg-gray-100 text-gray rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <FaHome />
                        Back to Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;
