import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGraduationCap, FaIdCard, FaEye, FaEyeSlash } from 'react-icons/fa';

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Please enter your full name');
            return;
        }

        if (!formData.email.trim()) {
            toast.error('Please enter your email');
            return;
        }

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

            // Remove empty fields
            Object.keys(registerData).forEach(key => {
                if (registerData[key] === '') {
                    delete registerData[key];
                }
            });

            console.log('📤 Sending registration data:', registerData);

            await register(registerData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('❌ Full error:', error);
            console.error('❌ Response data:', error.response?.data);

            // Handle validation errors from express-validator
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const firstError = error.response.data.errors[0];
                const errorMessage = firstError.msg || firstError.message || 'Validation failed';
                console.error('❌ Validation error:', errorMessage);
                toast.error(errorMessage);
            } else {
                const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-12">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-xl shadow-xl p-8">
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-white font-bold text-2xl"><img src="/logo.jpg" alt="" /></span>
                        </div>
                        <h1 className="text-3xl font-bold text-dark mb-2">Create Account</h1>
                        <p className="text-gray">Join the JUST Debating Club</p>
                    </div>

                    {/* Registration Fee Notice */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                        <p className="text-yellow-800 text-sm">
                            <strong>Note:</strong> After registration, a one-time fee of <strong>৳150</strong> is required to complete your membership.
                        </p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                                        placeholder="bappy.just@gmail.com"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                                        placeholder="+880 1XXX-XXXXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5">
                            {/* Student ID */}
                            <div>
                                <label htmlFor="studentId" className="block text-sm font-medium text-dark mb-2">
                                    Student ID
                                </label>
                                <div className="relative">
                                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="text"
                                        id="studentId"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                                        placeholder="ID"
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-dark mb-2">
                                    Department
                                </label>
                                <div className="relative">
                                    <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                                        placeholder="e.g., CSE"
                                    />
                                </div>
                            </div>

                            {/* Batch */}
                            <div>
                                <label htmlFor="batch" className="block text-sm font-medium text-dark mb-2">
                                    Batch
                                </label>
                                <input
                                    type="text"
                                    id="batch"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                                    placeholder="e.g., 2020-21"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        minLength={6}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray hover:text-primary transition"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                                        placeholder="Re-enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray hover:text-primary transition"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray mt-6">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-primary hover:text-primary-dark font-semibold transition"
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
