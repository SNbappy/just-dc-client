// pages/admin/EventParticipants.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FaArrowLeft,
    FaCheckCircle,
    FaTimesCircle,
    FaCertificate,
    FaDownload,
    FaUsers,
    FaUserTie,
    FaHandsHelping,
    FaGavel,
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateTemplate from '../../components/events/CertificateTemplate';

const ROLE_LABELS = {
    organizer: 'Organizer',
    volunteer: 'Volunteer',
    core_adjudicator: 'Core Adjudicator',
    tab_team: 'Tab Team',
    speaker: 'Speaker',
    guest: 'Guest',
};

const EventParticipants = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('registrants'); // 'registrants' | 'team'

    // Certificate generation
    const [generatingCert, setGeneratingCert] = useState(false);
    const [currentCertData, setCurrentCertData] = useState(null);
    const certRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eventRes, regRes] = await Promise.all([
                api.get(`/events/${id}`),
                // ✅ UPDATED: Changed URL from /events/${id}/registrations to /registrations/events/${id}
                api.get(`/registrations/events/${id}`),
            ]);

            setEvent(eventRes.data?.data || null);
            setRegistrations(regRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // ========== REGISTRANTS ACTIONS ==========

    const issueRegistrantCertificate = async (regId) => {
        try {
            await api.post(`/events/${id}/registrations/${regId}/certificate`);
            toast.success('Certificate issued');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to issue certificate');
        }
    };

    const revokeRegistrantCertificate = async (regId) => {
        if (!window.confirm('Revoke this certificate?')) return;
        try {
            await api.delete(`/events/${id}/registrations/${regId}/certificate`);
            toast.success('Certificate revoked');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to revoke certificate');
        }
    };

    const bulkIssueRegistrantCertificates = async () => {
        if (!window.confirm('Issue certificates to all confirmed registrants?')) return;
        try {
            const res = await api.post(`/events/${id}/registrations/bulk-certificate`);
            toast.success(res.data?.message || 'Certificates issued');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to issue certificates');
        }
    };

    // ========== TEAM ACTIONS ==========

    const issueTeamCertificate = async (index) => {
        try {
            await api.post(`/events/${id}/team/${index}/certificate`);
            toast.success('Certificate issued to team member');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to issue certificate');
        }
    };

    const revokeTeamCertificate = async (index) => {
        if (!window.confirm('Revoke certificate from this team member?')) return;
        try {
            await api.delete(`/events/${id}/team/${index}/certificate`);
            toast.success('Certificate revoked');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to revoke certificate');
        }
    };

    const bulkIssueTeamCertificates = async (role = null) => {
        const msg = role
            ? `Issue certificates to all ${ROLE_LABELS[role] || role}s?`
            : 'Issue certificates to ALL team members?';
        if (!window.confirm(msg)) return;

        try {
            const res = await api.post(`/events/${id}/team/bulk-certificate`, { role });
            toast.success(res.data?.message || 'Certificates issued');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to issue certificates');
        }
    };

    // ========== CERTIFICATE DOWNLOAD ==========

    const downloadCertificate = async (registration, isTeamMember = false) => {
        if (!registration.certificateIssued) {
            toast.error('Certificate not issued yet');
            return;
        }

        setCurrentCertData({ registration, event });
        setGeneratingCert(true);

        setTimeout(async () => {
            try {
                const element = certRef.current;
                if (!element) throw new Error('Certificate template not found');

                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                });

                // PNG download
                const imgData = canvas.toDataURL('image/png');
                const linkPNG = document.createElement('a');
                linkPNG.href = imgData;
                linkPNG.download = `certificate-${registration.credentialId || 'team'}.png`;
                linkPNG.click();

                // PDF download
                const pdf = new jsPDF('landscape', 'mm', 'a4');
                const imgWidth = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`certificate-${registration.credentialId || 'team'}.pdf`);

                toast.success('Certificate downloaded');
            } catch (error) {
                console.error('Error generating certificate:', error);
                toast.error('Failed to generate certificate');
            } finally {
                setGeneratingCert(false);
                setCurrentCertData(null);
            }
        }, 100);
    };

    // ========== GROUPED TEAM MEMBERS ==========

    const groupedTeam = () => {
        const participants = Array.isArray(event?.participants) ? event.participants : [];
        const groups = {};

        participants.forEach((p, idx) => {
            const role = p?.role || 'volunteer';
            if (!groups[role]) groups[role] = [];
            groups[role].push({ ...p, index: idx });
        });

        return groups;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <p className="text-gray">Event not found</p>
                <Link to="/dashboard/manage/events" className="btn-primary mt-4 inline-block">
                    Back to Events
                </Link>
            </div>
        );
    }

    const grouped = groupedTeam();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        to="/dashboard/manage/events"
                        className="text-gray hover:text-primary transition-colors"
                    >
                        <FaArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="font-heading font-bold text-3xl text-dark">{event.title}</h1>
                        <p className="text-gray">Participants & Certificate Management</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('registrants')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'registrants'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <FaUsers className="inline mr-2" />
                        Registrants ({registrations.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('team')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'team'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <FaUserTie className="inline mr-2" />
                        Event Team ({(event.participants || []).length})
                    </button>
                </div>
            </div>

            {/* ========== REGISTRANTS TAB ========== */}
            {activeTab === 'registrants' && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-dark">Registrants</h2>
                        <button
                            onClick={bulkIssueRegistrantCertificates}
                            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold"
                        >
                            <FaCertificate className="inline mr-2" />
                            Bulk Issue Certificates
                        </button>
                    </div>

                    {registrations.length === 0 ? (
                        <p className="text-gray text-center py-8">No registrants yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                                            Certificate
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {registrations.map((reg) => (
                                        <tr key={reg.id || reg._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-dark font-semibold">
                                                {/* ✅ UPDATED: Handle both user and guest registrations */}
                                                {reg.user?.name || reg.guestName || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-gray">
                                                {reg.user?.email || reg.guestEmail || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${reg.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {reg.certificateIssued ? (
                                                    <span className="text-green-600 flex items-center gap-2">
                                                        <FaCheckCircle />
                                                        Issued
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 flex items-center gap-2">
                                                        <FaTimesCircle />
                                                        Not Issued
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {!reg.certificateIssued ? (
                                                        <button
                                                            onClick={() =>
                                                                issueRegistrantCertificate(reg.id || reg._id)
                                                            }
                                                            disabled={reg.status !== 'confirmed'}
                                                            className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Issue
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => downloadCertificate(reg, false)}
                                                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center gap-1"
                                                            >
                                                                <FaDownload />
                                                                Download
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    revokeRegistrantCertificate(reg.id || reg._id)
                                                                }
                                                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                                                            >
                                                                Revoke
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ========== TEAM TAB ========== */}
            {activeTab === 'team' && (
                <div className="space-y-6">
                    {Object.keys(grouped).length === 0 ? (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <p className="text-gray text-center py-8">No team members added yet</p>
                        </div>
                    ) : (
                        Object.entries(grouped).map(([role, members]) => (
                            <div key={role} className="bg-white rounded-2xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-dark">
                                        {ROLE_LABELS[role] || role}s ({members.length})
                                    </h2>
                                    <button
                                        onClick={() => bulkIssueTeamCertificates(role)}
                                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold"
                                    >
                                        <FaCertificate className="inline mr-2" />
                                        Bulk Issue for {ROLE_LABELS[role] || role}s
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                                                    Name
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                                                    Type
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                                                    Details
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                                                    Certificate
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {members.map((member) => {
                                                const isInternal = member.type === 'internal';
                                                const name = isInternal
                                                    ? member.user?.name || 'Member'
                                                    : member.name || 'External';
                                                const details = isInternal
                                                    ? member.user?.email || ''
                                                    : [member.designation, member.org]
                                                        .filter(Boolean)
                                                        .join(' • ') || '—';

                                                const pseudoReg = {
                                                    name: name,
                                                    email: isInternal ? member.user?.email : member.name,
                                                    role: role,
                                                    certificateIssued: member.certificateIssued || false,
                                                    credentialId: member.credentialId || null,
                                                };

                                                return (
                                                    <tr key={member.index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-dark font-semibold">
                                                            {name}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${isInternal
                                                                        ? 'bg-primary/10 text-primary'
                                                                        : 'bg-gray-100 text-gray-600'
                                                                    }`}
                                                            >
                                                                {isInternal ? 'Internal' : 'External'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray text-sm">{details}</td>
                                                        <td className="px-4 py-3">
                                                            {member.certificateIssued ? (
                                                                <span className="text-green-600 flex items-center gap-2">
                                                                    <FaCheckCircle />
                                                                    Issued
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 flex items-center gap-2">
                                                                    <FaTimesCircle />
                                                                    Not Issued
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex gap-2">
                                                                {!member.certificateIssued ? (
                                                                    <button
                                                                        onClick={() =>
                                                                            issueTeamCertificate(member.index)
                                                                        }
                                                                        className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark"
                                                                    >
                                                                        Issue
                                                                    </button>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            onClick={() =>
                                                                                downloadCertificate(pseudoReg, true)
                                                                            }
                                                                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center gap-1"
                                                                        >
                                                                            <FaDownload />
                                                                            Download
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                revokeTeamCertificate(member.index)
                                                                            }
                                                                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                                                                        >
                                                                            Revoke
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Hidden certificate template for generation */}
            {currentCertData && (
                <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                    <CertificateTemplate
                        ref={certRef}
                        registration={currentCertData.registration}
                        event={currentCertData.event}
                    />
                </div>
            )}

            {generatingCert && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-dark font-semibold">Generating certificate...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventParticipants;
