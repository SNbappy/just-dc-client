import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaIdCard, FaLayerGroup, FaLock } from 'react-icons/fa';

const Profile = () => {
    const { user, updateUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPass, setChangingPass] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        batch: '',
        studentId: ''
    });

    const [passForm, setPassForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        const loadMe = async () => {
            try {
                // backend: GET /api/auth/me
                const res = await api.get('/auth/me');
                const me = res.data?.user || res.data;

                setForm({
                    name: me?.name || '',
                    email: me?.email || '',
                    phone: me?.phone || '',
                    department: me?.department || '',
                    batch: me?.batch || '',
                    studentId: me?.studentId || ''
                });

                // keep AuthContext fresh (optional)
                if (me) updateUser(me);
            } catch (e) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    const onPassChange = (e) => setPassForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // backend: PUT /api/auth/updatedetails
            const res = await api.put('/auth/updatedetails', {
                name: form.name,
                email: form.email, // you can keep readonly if you want; currently allowed
                phone: form.phone,
                department: form.department,
                batch: form.batch,
                studentId: form.studentId
            });

            const updated = res.data?.user || res.data;
            updateUser(updated);

            toast.success('Profile updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passForm.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }
        if (passForm.newPassword !== passForm.confirmNewPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setChangingPass(true);
        try {
            // backend: PUT /api/auth/updatepassword
            const res = await api.put('/auth/updatepassword', {
                currentPassword: passForm.currentPassword,
                newPassword: passForm.newPassword
            });

            // if backend returns token, store it
            if (res.data?.token) {
                localStorage.setItem('token', res.data.token);
            }

            setPassForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            toast.success('Password updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setChangingPass(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-dark">My Profile</h1>
                            <p className="text-gray mt-1">
                                Logged in as <span className="font-semibold">{user?.role}</span>
                            </p>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-gray-50 border text-sm text-gray-700">
                            <span className="font-semibold">Status:</span>{' '}
                            {user?.isActive === false ? 'Inactive' : 'Active'} •{' '}
                            <span className="font-semibold">Membership:</span> {user?.membershipStatus || 'pending'}
                        </div>
                    </div>
                </div>

                {/* Update profile */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-dark mb-4">Update Info</h2>

                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">Full Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={onChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    type="email"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                If you want email locked, tell me—I'll make it readonly.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">Phone</label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={onChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">Student ID</label>
                            <div className="relative">
                                <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    name="studentId"
                                    value={form.studentId}
                                    onChange={onChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">Department</label>
                            <div className="relative">
                                <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    name="department"
                                    value={form.department}
                                    onChange={onChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">Batch</label>
                            <div className="relative">
                                <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    name="batch"
                                    value={form.batch}
                                    onChange={onChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary w-full py-3 text-lg font-semibold"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change password */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-dark mb-4">Change Password</h2>

                    <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">Current</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passForm.currentPassword}
                                    onChange={onPassChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">New</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passForm.newPassword}
                                    onChange={onPassChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-2">Confirm</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={passForm.confirmNewPassword}
                                    onChange={onPassChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <button
                                type="submit"
                                disabled={changingPass}
                                className="btn-outline w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <FaLock />
                                {changingPass ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Profile;
