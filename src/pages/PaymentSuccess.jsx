import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tran_id = searchParams.get('tran_id');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-5xl text-green-500" />
                </div>

                <h1 className="text-3xl font-bold text-dark mb-3">Payment Successful!</h1>
                <p className="text-gray mb-2">
                    Your payment has been completed successfully.
                </p>

                {tran_id && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray mb-1">Transaction ID:</p>
                        <p className="font-mono text-sm font-semibold text-dark">{tran_id}</p>
                    </div>
                )}

                <p className="text-sm text-gray mb-8">
                    Please wait for admin verification. You will be notified once approved.
                </p>

                <div className="space-y-3">
                    <button onClick={() => navigate('/payments')} className="btn-primary w-full">
                        View Payment History
                    </button>
                    <button onClick={() => navigate('/')} className="btn-outline w-full">
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
