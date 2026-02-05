import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaEye, FaMoneyBillWave, FaUser, FaTimes, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import {
    getAllUsers,
    updateUserRole,
    updateMembershipStatus,
    deleteUser
} from '../../services/userService';
import { getPaymentsByUser } from '../../services/paymentService';

const Members = () => {
    const { user: currentUser } = useAuth();

    const isTopManagement = ['admin', 'president', 'general_secretary', 'moderator'].includes(currentUser?.role);
    const canChangeRoles = ['admin', 'president', 'general_secretary'].includes(currentUser?.role);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const [filter, setFilter] = useState({ role: '', membershipStatus: '', search: '' });

    // Modals
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPaymentsModal, setShowPaymentsModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    // Role modal
    const [newRole, setNewRole] = useState('user');

    // Payments modal
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        if (!isTopManagement) return;
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers(filter);
            setUsers(res.data || []);
        } catch (e) {
            toast.error('Failed to fetch users');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const openProfile = (u) => {
        setSelectedUser(u);
        setShowProfileModal(true);
    };

    const openPayments = async (u) => {
        setSelectedUser(u);
        setShowPaymentsModal(true);
        setPayments([]);
        setPaymentsLoading(true);
        try {
            const res = await getPaymentsByUser(u.id ?? u._id);
            setPayments(res.data || []);
        } catch (e) {
            toast.error('Failed to load payment history');
            console.error(e);
        } finally {
            setPaymentsLoading(false);
        }
    };

    const openRoleChange = (u) => {
        if (!canChangeRoles) {
            toast.error('You do not have permission to change roles');
            return;
        }
        setSelectedUser(u);
        setNewRole(u.role);
        setShowRoleModal(true);
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser) return;
        try {
            await updateUserRole(selectedUser.id ?? selectedUser._id, newRole);
            toast.success('Role updated');
            setShowRoleModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to update role');
            console.error(e);
        }
    };

    const handleMembershipUpdate = async (u, status) => {
        try {
            await updateMembershipStatus(u.id ?? u._id, status);
            toast.success(`Membership updated: ${status}`);
            fetchUsers();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to update membership');
            console.error(e);
        }
    };

    const handleDelete = async (u) => {
        if (currentUser?.role !== 'admin') {
            toast.error('Only admin can delete users');
            return;
        }
        const id = u.id ?? u._id;
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                toast.success('User deleted');
                fetchUsers();
            } catch (e) {
                toast.error(e.response?.data?.message || 'Failed to delete user');
                console.error(e);
            }
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: 'bg-purple-100 text-purple-700',
            president: 'bg-blue-100 text-blue-700',
            general_secretary: 'bg-indigo-100 text-indigo-700',
            executive_member: 'bg-cyan-100 text-cyan-700',
            moderator: 'bg-green-100 text-green-700',
            member: 'bg-teal-100 text-teal-700',
            user: 'bg-gray-100 text-gray-700'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[role] || badges.user}`}>
                {role?.replace('_', ' ')?.toUpperCase()}
            </span>
        );
    };

    const getMembershipBadge = (status) => {
        const badges = {
            approved: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            rejected: 'bg-red-100 text-red-700',
            inactive: 'bg-gray-100 text-gray-700'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || badges.pending}`}>
                {status?.toUpperCase()}
            </span>
        );
    };

    const paymentStatusText = (u) => {
        return u?.registrationFeePaid ? (
            <span className="text-green-600 text-sm font-semibold">Paid</span>
        ) : (
            <span className="text-red-600 text-sm font-semibold">Unpaid</span>
        );
    };

    const rolesForSelect = useMemo(() => ([
        'user',
        'member',
        'executive_member',
        'moderator',
        'general_secretary',
        'president',
        'admin'
    ]), []);

    if (!isTopManagement) {
        return (
            <div className="p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-dark mb-2">403 - Access Denied</h2>
                <p className="text-gray">You do not have permission to access this page.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-dark">Manage Members (Users)</h1>
                    <p className="text-gray mt-1">
                        View all accounts, membership, roles, profile details, and payment history.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Name, email, student ID"
                            value={filter.search}
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Role</label>
                        <select
                            value={filter.role}
                            onChange={(e) => setFilter({ ...filter, role: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">All Roles</option>
                            {rolesForSelect.map(r => (
                                <option key={r} value={r}>{r.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Membership Status</label>
                        <select
                            value={filter.membershipStatus}
                            onChange={(e) => setFilter({ ...filter, membershipStatus: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilter({ role: '', membershipStatus: '', search: '' })}
                            className="btn-outline w-full"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-dark">User</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Role</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Membership</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Reg Fee</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id ?? u._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <FaUser className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-dark">{u.name}</p>
                                                <p className="text-sm text-gray">{u.email}</p>
                                                {u.studentId && <p className="text-xs text-gray">ID: {u.studentId}</p>}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6">{getRoleBadge(u.role)}</td>

                                    <td className="py-4 px-6">
                                        <div className="flex flex-col gap-2">
                                            {getMembershipBadge(u.membershipStatus)}
                                            {u.membershipStatus === 'pending' && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleMembershipUpdate(u, 'approved')}
                                                        className="text-green-600 hover:text-green-700 text-sm font-semibold"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleMembershipUpdate(u, 'rejected')}
                                                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-4 px-6">
                                        {paymentStatusText(u)}
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {/* View profile */}
                                            <button
                                                onClick={() => openProfile(u)}
                                                className="text-gray-700 hover:text-primary"
                                                title="View Profile"
                                            >
                                                <FaEye size={18} />
                                            </button>

                                            {/* Payment history */}
                                            <button
                                                onClick={() => openPayments(u)}
                                                className="text-gray-700 hover:text-secondary"
                                                title="Payment History"
                                            >
                                                <FaMoneyBillWave size={18} />
                                            </button>

                                            {/* Role change */}
                                            {canChangeRoles && (
                                                <button
                                                    onClick={() => openRoleChange(u)}
                                                    className="text-gray-700 hover:text-primary"
                                                    title="Change Role"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                            )}

                                            {/* Delete (admin only) */}
                                            {currentUser?.role === 'admin' && (
                                                <button
                                                    onClick={() => handleDelete(u)}
                                                    className="text-red-600 hover:text-red-700"
                                                    title="Delete User"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ===================== MODALS ===================== */}

            {/* Profile Modal */}
            {showProfileModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold text-dark">User Profile</h3>
                            <button onClick={() => setShowProfileModal(false)} className="text-gray-500 hover:text-dark">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6 space-y-3">
                            <div>
                                <p className="text-sm text-gray">Name</p>
                                <p className="font-semibold text-dark">{selectedUser.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray">Email</p>
                                <p className="font-semibold text-dark">{selectedUser.email}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray">Phone</p>
                                    <p className="font-semibold text-dark">{selectedUser.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray">Student ID</p>
                                    <p className="font-semibold text-dark">{selectedUser.studentId || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray">Department</p>
                                    <p className="font-semibold text-dark">{selectedUser.department || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray">Batch</p>
                                    <p className="font-semibold text-dark">{selectedUser.batch || '-'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                {getRoleBadge(selectedUser.role)}
                                {getMembershipBadge(selectedUser.membershipStatus)}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t">
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="btn-outline w-full"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payments Modal */}
            {showPaymentsModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-dark">Payment History</h3>
                                <p className="text-sm text-gray">{selectedUser.name} • {selectedUser.email}</p>
                            </div>
                            <button onClick={() => setShowPaymentsModal(false)} className="text-gray-500 hover:text-dark">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6">
                            {paymentsLoading ? (
                                <div className="flex items-center justify-center min-h-[200px]">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                </div>
                            ) : payments.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No payment records found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-dark">Date</th>
                                                <th className="text-left py-3 px-4 font-semibold text-dark">Type</th>
                                                <th className="text-left py-3 px-4 font-semibold text-dark">Month</th>
                                                <th className="text-left py-3 px-4 font-semibold text-dark">Amount</th>
                                                <th className="text-left py-3 px-4 font-semibold text-dark">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((p) => (
                                                <tr key={p._id ?? p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm">
                                                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="py-3 px-4 capitalize">{p.type}</td>
                                                    <td className="py-3 px-4">{p.month || '-'}</td>
                                                    <td className="py-3 px-4 font-semibold">৳{p.amount}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${p.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                                p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                    p.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                                        'bg-gray-100 text-gray-700'}
                            `}>
                                                            {String(p.status).toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t">
                            <button onClick={() => setShowPaymentsModal(false)} className="btn-outline w-full">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Role Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold text-dark">Change Role</h3>
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="text-gray-500 hover:text-dark"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-gray mb-2">User</p>
                            <p className="font-semibold text-dark mb-4">{selectedUser.name}</p>

                            <label className="block text-sm font-medium text-dark mb-2">New Role</label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {rolesForSelect.map(r => (
                                    <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                ))}
                            </select>

                            <div className="flex gap-3 mt-6">
                                <button onClick={handleRoleUpdate} className="btn-primary flex-1">
                                    Update
                                </button>
                                <button onClick={() => setShowRoleModal(false)} className="btn-outline flex-1">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Members;
