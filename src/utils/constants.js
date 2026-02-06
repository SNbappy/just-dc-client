// utils/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
    ADMIN: 'admin',
    PRESIDENT: 'president',
    SECRETARY: 'secretary',
    MEMBER: 'member',
    ALUMNI: 'alumni',
};

export const MEMBERSHIP_STATUS = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    ALUMNI: 'alumni',
    PENDING: 'pending',
};

export const EVENT_CATEGORIES = {
    WORKSHOP: 'workshop',
    TOURNAMENT: 'tournament',
    PRACTICE: 'practice',
    GUEST_LECTURE: 'guest_lecture',
    SOCIAL: 'social',
};

export const BLOG_CATEGORIES = [
    'Debate Tips',
    'Event Recap',
    'Member Stories',
    'Tournament Results',
    'Club News',
];

// ✅ UPDATED: Navigation Links
export const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Track Registration', path: '/track-registration' }, // ✅ NEW
    { name: 'Verify Certificate', path: '/verify-certificate' },
    { name: 'Contact', path: '/contact' },
];
