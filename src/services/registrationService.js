// services/registrationService.js
import api from './api';

export const registrationService = {
    // Get registration categories for an event
    getCategories: async (eventId) => {
        const response = await api.get(`/registrations/events/${eventId}/categories`);
        return response.data;
    },

    // Register for event
    register: async (eventId, categoryId, data) => {
        const response = await api.post(
            `/registrations/events/${eventId}/categories/${categoryId}`,
            data
        );
        return response.data;
    },

    // Track registration by token
    trackRegistration: async (token) => {
        const response = await api.get(`/registrations/track?token=${token}`);
        return response.data;
    },

    // Get my registrations
    getMyRegistrations: async () => {
        const response = await api.get('/registrations/my-registrations');
        return response.data;
    },

    // Cancel registration
    cancelRegistration: async (registrationId) => {
        const response = await api.delete(`/registrations/${registrationId}`);
        return response.data;
    },
};
