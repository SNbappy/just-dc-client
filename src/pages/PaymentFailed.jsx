// src/pages/PaymentFailed.jsx
import { Link, useSearchParams } from 'react-router-dom';
import { FaTimesCircle, FaRedo, FaHome, FaHeadset } from 'react-icons/fa';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');
    const transaction = searchParams.get('transaction');

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Error Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-error/20 mb-6">
                        <FaTimesCircle className="text-6xl text-error" />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-dark mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-gray text-lg">
                        We couldn't process your payment
                    </p>
                </div>

                {/* Error Details */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-error mb-1">Error Details:</p>
                        <p className="text-sm text-gray">
                            {error === 'payment_not_found' && 'Payment record not found'}
                            {error === 'processing_error' && 'Payment processing error'}
                            {error === 'unknown' && 'An unknown error occurred'}
                            {!error && 'Payment was declined or failed'}
                        </p>
                        {transaction && (
                            <p className="text-xs text-gray mt-2">
                                Transaction ID: <span className="font-mono">{transaction}</span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 text-sm text-gray">
                        <p>⚠️ Your registration is still pending</p>
                        <p>💡 Please try again or use a different payment method</p>
                        <p>📞 Contact support if the issue persists</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => window.history.back()}
                        className="block w-full text-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                        <FaRedo />
                        Try Again
                    </button>
                    <Link
                        to="/dashboard/registrations"
                        className="block w-full text-center px-6 py-3 bg-white text-dark border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        View My Registrations
                    </Link>
                    <Link
                        to="/contact"
                        className="block w-full text-center px-6 py-3 bg-white text-dark border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <FaHeadset />
                        Contact Support
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

export default PaymentFailed;
