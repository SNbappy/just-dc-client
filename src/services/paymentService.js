import api from './api';

// Get all payments (Admin only)
export const getAllPayments = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/payments${params ? `?${params}` : ''}`);
    return response.data;
};

// Get my payments
export const getMyPayments = async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
};

// Verify payment (Admin only)
export const verifyPayment = async (paymentId, verificationData) => {
    const response = await api.put(`/payments/${paymentId}/verify`, verificationData);
    return response.data;
};

// Get payment statistics
export const getPaymentStats = async () => {
    const response = await api.get('/payments/stats');
    return response.data;
};

// Generate monthly payments (Admin only)
export const generateMonthlyPayments = async (month) => {
    const response = await api.post('/payments/generate-monthly', { month });
    return response.data;
};

// SSLCommerz - Initiate Payment
export const initiateSSLPayment = async (paymentData) => {
    const response = await api.post('/sslcommerz/init', paymentData);
    return response.data;
};
