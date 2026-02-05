import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthProvider';

const Profile = () => {
    const { user, updateUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        department: '',
        batch: '',
        studentId: '',
        avatar: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                department: user.department || '',
                batch: user.batch || '',
                studentId: user.studentId || '',
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        try {
            const res = await api.put(`/users/${user.id}`, formData);
            const updated = res?.data?.data;

            updateUser(updated); // updates localStorage + context
            toast.success('Profile updated successfully');
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-10">
            <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-dark mb-1">Update Profile</h1>
                <p className="text-gray mb-6">Edit your information and save changes.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">Student ID</label>
                            <input
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">Department</label>
                            <input
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">Batch</label>
                            <input
                                name="batch"
                                value={formData.batch}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-lg font-semibold"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
