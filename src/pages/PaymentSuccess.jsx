// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTicketAlt, FaHome } from 'react-icons/fa';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const registrationId = searchParams.get('registration');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = '/dashboard/registrations';
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/20 mb-6 animate-bounce">
                        <FaCheckCircle className="text-6xl text-success" />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-dark mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-gray text-lg">
                        Your registration has been confirmed
                    </p>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                        <FaTicketAlt className="text-2xl text-primary" />
                        <div>
                            <p className="text-sm text-gray">Registration ID</p>
                            <p className="font-mono font-bold text-dark">{registrationId || 'Processing...'}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-success">
                            <FaCheckCircle />
                            <span className="font-semibold">Payment confirmed</span>
                        </div>
                        <div className="flex items-center gap-2 text-success">
                            <FaCheckCircle />
                            <span className="font-semibold">Registration confirmed</span>
                        </div>
                        <div className="flex items-center gap-2 text-success">
                            <FaCheckCircle />
                            <span className="font-semibold">Confirmation email sent</span>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray">
                            📧 A confirmation email with your registration details and receipt has been sent to your email address.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        to="/dashboard/registrations"
                        className="block w-full text-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                    >
                        View My Registrations
                    </Link>
                    <Link
                        to="/events"
                        className="block w-full text-center px-6 py-3 bg-white text-dark border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <FaHome />
                        Browse More Events
                    </Link>
                </div>

                {/* Auto Redirect */}
                <p className="text-center text-sm text-gray mt-6">
                    Redirecting to dashboard in {countdown} seconds...
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
