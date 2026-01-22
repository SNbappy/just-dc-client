import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setSubmitSuccess(true);
            setIsSubmitting(false);

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        }, 1500);
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-heading font-bold text-4xl text-dark mb-4">
                        Send Us a Message
                    </h2>
                    <p className="text-gray text-lg">
                        Fill out the form below and we'll get back to you as soon as possible
                    </p>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
                        <p className="font-semibold">✓ Message sent successfully!</p>
                        <p className="text-sm">We'll get back to you soon.</p>
                    </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.name ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-primary focus:outline-none transition-colors`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-primary focus:outline-none transition-colors`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                    </div>

                    {/* Phone and Subject Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">
                                Phone Number *
                            </label>
                            <div className="relative">
                                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-primary focus:outline-none transition-colors`}
                                    placeholder="+880 1234-567890"
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.subject ? 'border-red-500' : 'border-gray-200'
                                    } focus:border-primary focus:outline-none transition-colors`}
                                placeholder="How can we help?"
                            />
                            {errors.subject && (
                                <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                            )}
                        </div>

                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">
                            Message *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.message ? 'border-red-500' : 'border-gray-200'
                                } focus:border-primary focus:outline-none transition-colors resize-none`}
                            placeholder="Tell us about your inquiry..."
                        />
                        {errors.message && (
                            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane />
                                    Send Message
                                </>
                            )}
                        </button>
                    </div>

                </form>

            </div>
        </section>
    );
};

export default ContactForm;
