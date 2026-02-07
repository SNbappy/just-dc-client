import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            // Call API directly
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
            });

            console.log('Login response:', response.data);

            // Get token and user from response
            const { token, user } = response.data;

            if (!token || !user) {
                throw new Error('Invalid response format');
            }

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Update context (pass user and token)
            authLogin(user, token);

            toast.success('Login successful!');

            // Small delay to ensure state is updated
            setTimeout(() => {
                // Redirect to dashboard home
                navigate('/dashboard/home');
            }, 100);

        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-xl p-8">
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl"><img src="/logo.jpg" alt="JUST DC Logo" /></span>
                        </div>
                        <h1 className="text-3xl font-bold text-dark mb-2">Welcome Back</h1>
                        <p className="text-gray">Login to your JUST DC account</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                                Email Address <span className="text-red-500">*</span>
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
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
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
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-gray mt-6">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-primary hover:text-primary-dark font-semibold transition"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
