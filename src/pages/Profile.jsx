import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaIdCard, FaLayerGroup, FaLock, FaCamera, FaTrash } from 'react-icons/fa';

const Profile = () => {
    const { user, updateUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPass, setChangingPass] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        batch: '',
        studentId: '',
        avatar: ''
    });

    const [passForm, setPassForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        const loadMe = async () => {
            try {
                const res = await api.get('/auth/me');
                const me = res.data?.user || res.data;

                setForm({
                    name: me?.name || '',
                    email: me?.email || '',
                    phone: me?.phone || '',
                    department: me?.department || '',
                    batch: me?.batch || '',
                    studentId: me?.studentId || '',
                    avatar: me?.avatar || ''
                });

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

    // Handle image upload to Cloudinary
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a valid image (JPEG, PNG, JPG, WEBP)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size should be less than 10MB');
            return;
        }

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'just-dc/profile-images');

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const imageUrl = res.data?.data?.url;

            if (!imageUrl) {
                throw new Error('No image URL in response');
            }

            // Update form state
            setForm(prev => ({ ...prev, avatar: imageUrl }));

            // Update user profile with new image
            const updateRes = await api.put('/auth/updatedetails', {
                avatar: imageUrl
            });

            const updated = updateRes.data?.user || updateRes.data;
            updateUser(updated);

            toast.success('Profile image updated successfully');
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    // Remove profile image
    const handleRemoveImage = async () => {
        if (!window.confirm('Are you sure you want to remove your profile image?')) {
            return;
        }

        try {
            const res = await api.put('/auth/updatedetails', {
                avatar: ''
            });

            const updated = res.data?.user || res.data;
            setForm(prev => ({ ...prev, avatar: '' }));
            updateUser(updated);

            toast.success('Profile image removed');
        } catch (err) {
            toast.error('Failed to remove image');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.put('/auth/updatedetails', {
                name: form.name,
                email: form.email,
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
            const res = await api.put('/auth/updatepassword', {
                currentPassword: passForm.currentPassword,
                newPassword: passForm.newPassword
            });

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
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-gray font-semibold">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Profile Image Section */}
                    <div className="relative">
                        {form.avatar ? (
                            <img
                                src={form.avatar}
                                alt={form.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-primary text-5xl font-bold shadow-lg">
                                {form.name?.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Upload Button */}
                        <label className="absolute bottom-0 right-0 w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                            {uploadingImage ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                            ) : (
                                <FaCamera />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploadingImage}
                            />
                        </label>

                        {/* Remove Button */}
                        {form.avatar && (
                            <button
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <FaTrash className="text-xs" />
                            </button>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">{form.name}</h1>
                        <p className="text-white/90 mb-4">{form.email}</p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                                {user?.role?.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${user?.isActive ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}>
                                {user?.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="px-4 py-1.5 bg-yellow-500/20 rounded-full text-sm font-semibold capitalize">
                                {user?.membershipStatus || 'pending'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Profile Form */}
            <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-dark mb-6">Personal Information</h2>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Full Name *</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Email *</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50"
                                type="email"
                                required
                                readOnly
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Phone</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Student ID</label>
                        <div className="relative">
                            <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="studentId"
                                value={form.studentId}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Department</label>
                        <div className="relative">
                            <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="department"
                                value={form.department}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Batch</label>
                        <div className="relative">
                            <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="batch"
                                value={form.batch}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            {saving ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-dark mb-6">Change Password</h2>

                <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Current Password *</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="currentPassword"
                                value={passForm.currentPassword}
                                onChange={onPassChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">New Password *</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="newPassword"
                                value={passForm.newPassword}
                                onChange={onPassChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Confirm New Password *</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={passForm.confirmNewPassword}
                                onChange={onPassChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            disabled={changingPass}
                            className="w-full py-4 bg-gray-800 text-white font-bold text-lg rounded-xl hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <FaLock />
                            {changingPass ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
