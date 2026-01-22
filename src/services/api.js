import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// MOCK DATA FOR TESTING (Remove when backend is ready)
let mockEvents = [
    {
        _id: '1',
        title: 'Inter-University Debate Championship',
        description: 'Annual debate competition featuring teams from universities across the country.',
        date: '2026-02-15',
        time: '10:00 AM',
        location: 'JUST Auditorium',
        category: 'tournament',
        maxParticipants: 100,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    },
    {
        _id: '2',
        title: 'Public Speaking Workshop',
        description: 'Learn the art of public speaking from expert trainers.',
        date: '2026-02-08',
        time: '2:00 PM',
        location: 'Room 301, AB Building',
        category: 'workshop',
        maxParticipants: 50,
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    },
    {
        _id: '3',
        title: 'Weekly Practice Session',
        description: 'Regular practice session for all club members.',
        date: '2026-01-28',
        time: '4:00 PM',
        location: 'Debate Club Room',
        category: 'practice',
        maxParticipants: 30,
        image: '',
    },
    {
        _id: '4',
        title: 'Critical Thinking Seminar',
        description: 'Seminar on developing critical thinking and argumentation skills.',
        date: '2025-12-20',
        time: '11:00 AM',
        location: 'Conference Hall',
        category: 'seminar',
        maxParticipants: 80,
        image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
    },
];

// Mock API functions
const mockAPI = {
    get: async (url) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        if (url === '/events') {
            return { data: mockEvents };
        }
        return { data: [] };
    },

    post: async (url, data) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (url === '/events') {
            const newEvent = {
                ...data,
                _id: Date.now().toString(),
            };
            mockEvents.push(newEvent);
            return { data: newEvent };
        }
        return { data: {} };
    },

    put: async (url, data) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (url.startsWith('/events/')) {
            const id = url.split('/')[2];
            const index = mockEvents.findIndex(e => e._id === id);
            if (index !== -1) {
                mockEvents[index] = { ...mockEvents[index], ...data };
                return { data: mockEvents[index] };
            }
        }
        return { data: {} };
    },

    delete: async (url) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (url.startsWith('/events/')) {
            const id = url.split('/')[2];
            mockEvents = mockEvents.filter(e => e._id !== id);
            return { data: { success: true } };
        }
        return { data: {} };
    },
};

// USE MOCK API FOR TESTING - Switch to real api when backend is ready
// Change this to 'api' when backend is implemented
export default mockAPI;

// When backend is ready, use this:
// export default api;
