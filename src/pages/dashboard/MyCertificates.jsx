// pages/dashboard/MyCertificates.jsx
import { useEffect, useState } from "react";
import { FaCertificate, FaDownload, FaExternalLinkAlt, FaSpinner } from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";
import CertificateGenerator from "../../components/events/CertificateGenerator";

const MyCertificates = () => {
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);

    // Certificate preview
    const [selectedCert, setSelectedCert] = useState(null);
    const [showCertModal, setShowCertModal] = useState(false);

    useEffect(() => {
        fetchMyCertificates();
    }, []);

    const fetchMyCertificates = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users/my-certificates");
            setCertificates(res.data?.data || []);
        } catch (error) {
            console.error("Error fetching certificates:", error);
            toast.error("Failed to load certificates");
        } finally {
            setLoading(false);
        }
    };

    const openCertificate = (cert) => {
        setSelectedCert(cert);
        setShowCertModal(true);
    };

    const roleLabel = (role) => {
        return role?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading font-bold text-3xl text-dark mb-2">
                    My Certificates
                </h1>
                <p className="text-gray">
                    All certificates you've earned from events
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <FaCertificate className="text-2xl text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray">Total Certificates</p>
                            <p className="text-2xl font-bold text-dark">{certificates.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <FaCertificate className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray">This Year</p>
                            <p className="text-2xl font-bold text-dark">
                                {certificates.filter((c) => {
                                    const year = new Date(c.event?.date).getFullYear();
                                    return year === new Date().getFullYear();
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                            <FaCertificate className="text-2xl text-secondary" />
                        </div>
                        <div>
                            <p className="text-sm text-gray">Latest</p>
                            <p className="text-sm font-semibold text-dark">
                                {certificates.length > 0
                                    ? new Date(certificates[0]?.certificateIssuedAt).toLocaleDateString()
                                    : 'None'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificates Grid */}
            {certificates.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="font-bold text-xl text-dark mb-2">No Certificates Yet</h3>
                    <p className="text-gray mb-6">
                        Participate in events to earn certificates
                    </p>
                    <a href="/events" className="btn-primary inline-block">
                        Browse Events
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => {
                        const eventDate = new Date(cert.event?.date);
                        const issuedDate = new Date(cert.certificateIssuedAt || cert.updatedAt);

                        return (
                            <div
                                key={cert.id}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Certificate Header */}
                                <div className="h-32 bg-gradient-to-br from-primary to-secondary relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FaCertificate className="text-6xl text-white opacity-20" />
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-white/90 text-primary text-xs font-semibold rounded-full">
                                            {roleLabel(cert.role || 'participant')}
                                        </span>
                                    </div>
                                </div>

                                {/* Certificate Body */}
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-dark mb-2 line-clamp-2">
                                        {cert.event?.title || 'Event Title'}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray">
                                            <span>📅</span>
                                            <span>
                                                {eventDate.toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray">
                                            <span>🎓</span>
                                            <span>
                                                Issued: {issuedDate.toLocaleDateString()}
                                            </span>
                                        </div>

                                        {cert.credentialId && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray mb-1">Credential ID</p>
                                                <p className="font-mono text-xs text-dark font-semibold break-all">
                                                    {cert.credentialId}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openCertificate(cert)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                                        >
                                            <FaDownload />
                                            Download
                                        </button>

                                        {cert.credentialId && (
                                            <a
                                                href={`/verify-certificate?id=${cert.credentialId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-dark font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                            >
                                                <FaExternalLinkAlt />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Certificate Preview Modal */}
            {showCertModal && selectedCert && (
                <CertificateGenerator
                    registration={selectedCert}
                    event={selectedCert.event}
                    onClose={() => {
                        setShowCertModal(false);
                        setSelectedCert(null);
                    }}
                />
            )}
        </div>
    );
};

export default MyCertificates;
