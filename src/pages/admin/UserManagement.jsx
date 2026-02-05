import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, updateMembershipStatus, deleteUser } from '../../services/userService';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const USER_ROLES = [
    { value: 'user', label: 'User' },
    { value: 'member', label: 'Member' },
    { value: 'executive_member', label: 'Executive Member' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'general_secretary', label: 'General Secretary' },
    { value: 'president', label: 'President' },
    { value: 'admin', label: 'Admin' },
];

const UserManagement = () => {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState({ role: '', membershipStatus: '', search: '' });

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    // Only admin/president/GS can change roles
    const canChangeRoles = ['admin', 'president', 'general_secretary'].includes(currentUser?.role);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.role, filter.membershipStatus, filter.search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getAllUsers(filter);
            setUsers(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch users');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getUserId = (u) => u?.id ?? u?._id;

    const handleMembershipStatusChange = async (userId, status) => {
        try {
            await updateMembershipStatus(userId, status);
            toast.success(`Membership status updated to ${status}`);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update membership status');
        }
    };

    const openEditModal = (u) => {
        if (!canChangeRoles) {
            toast.error('You do not have permission to change roles');
            return;
        }

        // Prevent editing own role (recommended)
        if (getUserId(u) === getUserId(currentUser)) {
            toast.error('You cannot change your own role');
            return;
        }

        setSelectedUser(u);
        setNewRole(u.role);
        setShowEditModal(true);
    };

    const handleRoleChange = async () => {
        if (!canChangeRoles) {
            toast.error('You do not have permission to change roles');
            return;
        }

        const targetId = getUserId(selectedUser);

        // double safety
        if (targetId === getUserId(currentUser)) {
            toast.error('You cannot change your own role');
            return;
        }

        try {
            await updateUserRole(targetId, newRole);
            toast.success('User role updated successfully');
            setShowEditModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user role');
        }
    };

    const handleDelete = async (userId) => {
        if (currentUser?.role !== 'admin') {
            toast.error('Only admin can delete users');
            return;
        }

        if (userId === getUserId(currentUser)) {
            toast.error('You cannot delete your own account');
            return;
        }

        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
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
            user: 'bg-gray-100 text-gray-700',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[role] || badges.user}`}>
                {String(role || 'user').replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    const getMembershipBadge = (status) => {
        const badges = {
            approved: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            rejected: 'bg-red-100 text-red-700',
            inactive: 'bg-gray-100 text-gray-700',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status] || badges.pending}`}>
                {String(status || 'pending').toUpperCase()}
            </span>
        );
    };

    const getPaymentBadge = (u) => {
        if (u.registrationFeePaid) {
            return (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                    <FaCheckCircle />
                    Paid
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 text-red-600 text-sm">
                <FaTimesCircle />
                Unpaid
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-dark">User Management</h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Name, email, or student ID"
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
                            {USER_ROLES.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
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

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-dark">User</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Role</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Membership</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Reg. Fee</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Joined</th>
                                <th className="text-left py-4 px-6 font-semibold text-dark">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => {
                                const id = getUserId(u);
                                const isSelf = id === getUserId(currentUser);

                                return (
                                    <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-medium text-dark">{u.name}</p>
                                                <p className="text-sm text-gray">{u.email}</p>
                                                {u.studentId && <p className="text-sm text-gray">ID: {u.studentId}</p>}
                                                {isSelf && <p className="text-xs text-primary font-semibold mt-1">This is you</p>}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">{getRoleBadge(u.role)}</td>

                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-2">
                                                {getMembershipBadge(u.membershipStatus)}
                                                {u.membershipStatus === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleMembershipStatusChange(id, 'approved')}
                                                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleMembershipStatusChange(id, 'rejected')}
                                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">{getPaymentBadge(u)}</td>

                                        <td className="py-4 px-6 text-sm text-gray">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {canChangeRoles && !isSelf && (
                                                    <button
                                                        onClick={() => openEditModal(u)}
                                                        className="text-primary hover:text-primary-dark"
                                                        title="Edit Role"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>
                                                )}

                                                {currentUser?.role === 'admin' && !isSelf && (
                                                    <button
                                                        onClick={() => handleDelete(id)}
                                                        className="text-red-600 hover:text-red-700"
                                                        title="Delete User"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Role Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-dark mb-4">Change User Role</h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray mb-1">User</p>
                            <p className="font-medium text-dark">{selectedUser.name}</p>
                            <p className="text-sm text-gray">{selectedUser.email}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-dark mb-2">New Role</label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {USER_ROLES.map((r) => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>

                            <p className="text-xs text-gray-500 mt-2">
                                Only Admin / President / General Secretary can change roles.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleRoleChange} className="btn-primary flex-1">
                                Update Role
                            </button>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedUser(null);
                                }}
                                className="btn-outline flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
