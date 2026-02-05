import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        // If unauthorized: clear auth and redirect to login
        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // avoid redirect loop
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
