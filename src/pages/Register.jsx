import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGraduationCap, FaIdCard, FaMoneyBillWave } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        department: '',
        batch: '',
        studentId: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            toast.success('Registration successful! Please login and complete payment.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Payment Notice */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                    <div className="flex">
                        <FaMoneyBillWave className="text-yellow-400 text-xl mr-3 mt-1" />
                        <div>
                            <h3 className="text-yellow-800 font-semibold mb-1">Registration Fee Required</h3>
                            <p className="text-yellow-700 text-sm">
                                After registration, you need to pay a one-time registration fee of <strong>৳150</strong> to complete your membership.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-dark mb-2">Create Account</h1>
                        <p className="text-gray">Join the JUST Debating Club</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="+880 1XXX-XXXXXX"
                                    />
                                </div>
                            </div>

                            {/* Student ID */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">
                                    Student ID
                                </label>
                                <div className="relative">
                                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Your student ID"
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">
                                    Department
                                </label>
                                <div className="relative">
                                    <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="e.g., CSE"
                                    />
                                </div>
                            </div>

                            {/* Batch */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">
                                    Batch
                                </label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g., 2022"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-dark mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Re-enter password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 text-lg font-semibold"
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <p className="text-center text-gray mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
