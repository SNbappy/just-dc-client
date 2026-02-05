// pages/VerifyCertificate.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSearch, FaSpinner } from 'react-icons/fa';
import api from '../services/api';

const VerifyCertificate = () => {
    const [searchParams] = useSearchParams();
    const [credentialId, setCredentialId] = useState(searchParams.get('id') || '');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setCredentialId(id);
            verifyCredential(id);
        }
    }, [searchParams]);

    const verifyCredential = async (id) => {
        if (!id.trim()) return;

        try {
            setLoading(true);
            setResult(null);

            // Call backend API to verify
            const res = await api.get(`/events/verify-certificate/${id.trim()}`);
            setResult(res.data);
        } catch (error) {
            setResult({
                success: false,
                message: error?.response?.data?.message || 'Certificate not found or invalid',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyCredential(credentialId);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
                        <span className="text-3xl font-bold text-white">JDC</span>
                    </div>
                    <h1 className="text-4xl font-bold text-dark mb-2">Verify Certificate</h1>
                    <p className="text-gray">
                        Enter the credential ID or scan the QR code to verify authenticity
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">
                                Credential ID
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={credentialId}
                                    onChange={(e) => setCredentialId(e.target.value)}
                                    placeholder="Enter credential ID (e.g., JDC-12-345-1234567890)"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-lg"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !credentialId.trim()}
                            className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <FaSearch />
                                    Verify Certificate
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Result */}
                {result && (
                    <div
                        className={`bg-white rounded-2xl shadow-md p-8 border-4 ${result.success ? 'border-green-500' : 'border-red-500'
                            }`}
                    >
                        <div className="text-center mb-6">
                            {result.success ? (
                                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                            ) : (
                                <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                            )}
                            <h2
                                className={`text-3xl font-bold mb-2 ${result.success ? 'text-green-700' : 'text-red-700'
                                    }`}
                            >
                                {result.success ? 'Certificate Valid ✓' : 'Certificate Invalid ✗'}
                            </h2>
                            <p className="text-gray">{result.message}</p>
                        </div>

                        {result.success && result.data && (
                            <div className="space-y-4 border-t pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray mb-1">Participant Name</p>
                                        <p className="font-bold text-lg text-dark">
                                            {result.data.participantName}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray mb-1">Event</p>
                                        <p className="font-bold text-lg text-dark">
                                            {result.data.eventTitle}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray mb-1">Role</p>
                                        <p className="font-bold text-lg text-dark capitalize">
                                            {result.data.role?.replace(/_/g, ' ')}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray mb-1">Event Date</p>
                                        <p className="font-bold text-lg text-dark">
                                            {new Date(result.data.eventDate).toLocaleDateString(
                                                'en-US',
                                                {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }
                                            )}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                                        <p className="text-sm text-gray mb-1">Credential ID</p>
                                        <p className="font-mono text-sm text-primary font-semibold">
                                            {result.data.credentialId}
                                        </p>
                                    </div>
                                </div>

                                {result.data.certificateUrl && (
                                    <div className="text-center pt-4">
                                        <a
                                            href={result.data.certificateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                                        >
                                            View Certificate
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link
                        to="/"
                        className="text-primary hover:text-primary-dark font-semibold transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;
