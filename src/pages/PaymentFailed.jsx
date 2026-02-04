import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailed = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaTimesCircle className="text-5xl text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-dark mb-3">Payment Failed</h1>
                <p className="text-gray mb-8">
                    Unfortunately, your payment could not be processed. Please try again.
                </p>

                <div className="space-y-3">
                    <button onClick={() => navigate('/payments')} className="btn-primary w-full">
                        Try Again
                    </button>
                    <button onClick={() => navigate('/')} className="btn-outline w-full">
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
