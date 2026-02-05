// components/events/CertificateGenerator.jsx
import { useRef, useState } from 'react';
import { FaDownload, FaTimes, FaSpinner } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateTemplate from './CertificateTemplate';
import toast from 'react-hot-toast';

const CertificateGenerator = ({ registration, event, onClose }) => {
    const certificateRef = useRef();
    const [downloading, setDownloading] = useState(false);

    const participantName = registration?.name || registration?.user?.name || 'Participant';
    const role = registration?.role || 'participant';
    const credentialId = registration?.credentialId || 'NO-CREDENTIAL';

    const verificationUrl = `${window.location.origin}/verify-certificate?id=${credentialId}`;

    const certificateData = {
        participantName,
        eventTitle: event?.title || 'Event',
        eventDate: event?.date,
        role,
        credentialId,
        organizationName: 'JUST Debate Club',
        verificationUrl,
    };

    const downloadAsPNG = async () => {
        if (!certificateRef.current) return;

        try {
            setDownloading(true);
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const link = document.createElement('a');
            link.download = `Certificate_${participantName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            toast.success('Certificate downloaded as PNG');
        } catch (error) {
            console.error('Error generating PNG:', error);
            toast.error('Failed to download PNG');
        } finally {
            setDownloading(false);
        }
    };

    const downloadAsPDF = async () => {
        if (!certificateRef.current) return;

        try {
            setDownloading(true);
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate_${participantName.replace(/\s+/g, '_')}.pdf`);

            toast.success('Certificate downloaded as PDF');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to download PDF');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                    <h3 className="text-xl font-bold text-dark">Certificate Preview</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-dark transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Certificate Preview */}
                <div className="p-8 bg-gray-50">
                    <div className="flex justify-center mb-6">
                        <div className="inline-block shadow-2xl rounded-xl overflow-hidden">
                            <CertificateTemplate ref={certificateRef} data={certificateData} />
                        </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={downloadAsPNG}
                            disabled={downloading}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors"
                        >
                            {downloading ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaDownload />
                            )}
                            Download PNG
                        </button>

                        <button
                            onClick={downloadAsPDF}
                            disabled={downloading}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-dark disabled:opacity-50 transition-colors"
                        >
                            {downloading ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaDownload />
                            )}
                            Download PDF
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
                        <p className="text-sm text-gray-700">
                            <strong>Credential ID:</strong>{' '}
                            <span className="font-mono text-primary">{credentialId}</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            This certificate can be verified at:{' '}
                            <a
                                href={verificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {verificationUrl}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateGenerator;
