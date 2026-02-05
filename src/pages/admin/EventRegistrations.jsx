import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaSearch,
    FaCheckCircle,
    FaTimesCircle,
    FaCertificate,
    FaMoneyBillWave,
} from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";

const badge = (text, cls) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
        {text}
    </span>
);

const EventRegistrations = () => {
    const { id } = useParams(); // eventId
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [eventTitle, setEventTitle] = useState("");

    const [search, setSearch] = useState("");
    const [filterPay, setFilterPay] = useState("all"); // all | pending | paid | failed
    const [filterCert, setFilterCert] = useState("all"); // all | issued | not_issued

    const fetchAll = async () => {
        try {
            setLoading(true);

            // fetch event title (optional UI)
            const evRes = await api.get(`/events/${id}`);
            setEventTitle(evRes?.data?.data?.title || "");

            // registrations list
            const res = await api.get(`/events/${id}/registrations`);
            setRows(res?.data?.data || []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load registrations");
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return (rows || []).filter((r) => {
            const name =
                (r?.user?.name || r?.name || r?.guestName || "").toLowerCase();
            const email =
                (r?.user?.email || r?.email || r?.guestEmail || "").toLowerCase();
            const phone = (r?.phone || r?.guestPhone || "").toLowerCase();
            const tx = (r?.transactionId || "").toLowerCase();

            const matchesSearch =
                !q ||
                name.includes(q) ||
                email.includes(q) ||
                phone.includes(q) ||
                tx.includes(q);

            const payStatus =
                (r.paymentStatus || "").toLowerCase() ||
                (r.status || "").toLowerCase();

            const certIssued = Boolean(r.certificateIssued);

            const matchesPay =
                filterPay === "all" ? true : payStatus === filterPay;

            const matchesCert =
                filterCert === "all"
                    ? true
                    : filterCert === "issued"
                        ? certIssued
                        : !certIssued;

            return matchesSearch && matchesPay && matchesCert;
        });
    }, [rows, search, filterPay, filterCert]);

    const verifyPayment = async (regId, paymentStatus) => {
        try {
            const ok = window.confirm(
                `Are you sure you want to mark this payment as "${paymentStatus}"?`
            );
            if (!ok) return;

            await api.put(`/events/${id}/registrations/${regId}/verify`, {
                paymentStatus,
            });

            toast.success(
                paymentStatus === "paid"
                    ? "Payment verified. Registration confirmed."
                    : "Payment marked as failed."
            );

            fetchAll();
        } catch (e) {
            console.error(e);
            toast.error(e?.response?.data?.message || "Failed to verify payment");
        }
    };

    const issueCertificate = async (regId) => {
        try {
            const ok = window.confirm("Issue certificate for this registration?");
            if (!ok) return;

            const res = await api.post(
                `/events/${id}/registrations/${regId}/issue-certificate`
            );

            const credentialId = res?.data?.credentialId;
            toast.success("Certificate issued");

            if (credentialId) {
                navigator.clipboard?.writeText(credentialId).catch(() => { });
                toast("Credential ID copied to clipboard");
            }

            fetchAll();
        } catch (e) {
            console.error(e);
            toast.error(e?.response?.data?.message || "Failed to issue certificate");
        }
    };

    const paymentBadge = (r) => {
        const p = (r.paymentStatus || "").toLowerCase();
        if (p === "paid") return badge("Paid", "bg-green-100 text-green-700");
        if (p === "failed") return badge("Failed", "bg-red-100 text-red-700");
        if (p === "pending") return badge("Pending", "bg-yellow-100 text-yellow-700");
        if (p === "none") return badge("No Payment", "bg-gray-100 text-gray-600");
        return badge(p || "Unknown", "bg-gray-100 text-gray-600");
    };

    const certBadge = (r) => {
        if (r.certificateIssued)
            return badge("Issued", "bg-green-100 text-green-700");
        return badge("Not Issued", "bg-gray-100 text-gray-600");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard/manage/events"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-dark font-semibold"
                        >
                            <FaArrowLeft />
                            Back
                        </Link>

                        <h1 className="font-heading font-bold text-2xl text-dark">
                            Registrations
                        </h1>
                    </div>

                    <p className="text-gray mt-2">
                        {eventTitle ? (
                            <>
                                Event: <span className="font-semibold text-dark">{eventTitle}</span>
                            </>
                        ) : (
                            "Manage registrations, verify payments, and issue certificates."
                        )}
                    </p>
                </div>

                <button
                    onClick={fetchAll}
                    className="px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark"
                >
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, phone, transaction id..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        />
                    </div>

                    <select
                        value={filterPay}
                        onChange={(e) => setFilterPay(e.target.value)}
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                    >
                        <option value="all">All Payments</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </select>

                    <select
                        value={filterCert}
                        onChange={(e) => setFilterCert(e.target.value)}
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                    >
                        <option value="all">All Certificates</option>
                        <option value="issued">Issued</option>
                        <option value="not_issued">Not Issued</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray">
                        Total: <span className="font-semibold text-dark">{filtered.length}</span>
                    </p>
                </div>

                {filtered.length === 0 ? (
                    <div className="p-10 text-center text-gray">
                        No registrations found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-gray-600">
                                    <th className="p-4">Participant</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4">Certificate</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((r) => {
                                    const regId = r.id ?? r._id;

                                    const name = r?.user?.name || r?.name || r?.guestName || "Unknown";
                                    const email = r?.user?.email || r?.email || r?.guestEmail || "";
                                    const phone = r?.phone || r?.guestPhone || "";

                                    return (
                                        <tr key={regId} className="border-t border-gray-100">
                                            <td className="p-4">
                                                <div className="font-semibold text-dark">{name}</div>
                                                <div className="text-xs text-gray">
                                                    {r.userId ? "Internal" : "Guest"}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="text-dark">{email || "-"}</div>
                                                <div className="text-xs text-gray">{phone || "-"}</div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    {paymentBadge(r)}
                                                    <div className="text-xs text-gray">
                                                        <FaMoneyBillWave className="inline mr-2 text-gray-400" />
                                                        {r.paymentMethod || "-"}{" "}
                                                        {r.transactionId ? `• TX: ${r.transactionId}` : ""}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    {certBadge(r)}
                                                    {r.credentialId ? (
                                                        <div className="text-xs text-gray">
                                                            Credential:{" "}
                                                            <span className="font-semibold text-dark">
                                                                {r.credentialId}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-gray">Credential: -</div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => verifyPayment(regId, "paid")}
                                                        className="px-3 py-2 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 flex items-center gap-2"
                                                    >
                                                        <FaCheckCircle />
                                                        Verify Paid
                                                    </button>

                                                    <button
                                                        onClick={() => verifyPayment(regId, "failed")}
                                                        className="px-3 py-2 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 flex items-center gap-2"
                                                    >
                                                        <FaTimesCircle />
                                                        Mark Failed
                                                    </button>

                                                    <button
                                                        onClick={() => issueCertificate(regId)}
                                                        className="px-3 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 flex items-center gap-2"
                                                        disabled={Boolean(r.certificateIssued) !== false ? true : false}
                                                        title={r.certificateIssued ? "Already issued" : "Issue certificate"}
                                                    >
                                                        <FaCertificate />
                                                        {r.certificateIssued ? "Issued" : "Issue Cert"}
                                                    </button>
                                                </div>

                                                {r.certificateIssued && (
                                                    <div className="text-xs text-gray mt-2">
                                                        Certificate already issued.
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventRegistrations;
