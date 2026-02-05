import api from "./api";

/* ================= USER PAYMENTS ================= */

// Get own payments
export const getMyPayments = async () => {
    const res = await api.get("/payments/my-payments");
    return res.data; // { success, count, data }
};

/* ================= SSL PAYMENT (ONLINE) ================= */

// ✅ Start SSLCommerz payment (backend should have POST /api/sslcommerz/initiate)
export const initiateSSLPayment = async (paymentData) => {
    const res = await api.post("/sslcommerz/initiate", paymentData);
    return res.data; // should return { success, data: { paymentUrl } }
};

/* ================= MANAGEMENT (OPTIONAL) ================= */

export const getAllPayments = async (filters = {}) => {
    const res = await api.get("/payments", { params: filters });
    return res.data;
};

export const getPaymentsByUser = async (userId) => {
    if (!userId) throw new Error("userId is required");
    const res = await api.get("/payments", { params: { userId } });
    return res.data;
};

export const verifyPayment = async (paymentId, payload) => {
    const res = await api.put(`/payments/${paymentId}/verify`, payload);
    return res.data;
};

export const getPaymentStats = async () => {
    const res = await api.get("/payments/stats");
    return res.data;
};

export const generateMonthlyPayments = async (month) => {
    const res = await api.post("/payments/generate-monthly", { month });
    return res.data;
};
