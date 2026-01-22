// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    PRESIDENT: 'president',
    SECRETARY: 'secretary',
    MEMBER: 'member',
    ALUMNI: 'alumni',
};

// Membership Status
export const MEMBERSHIP_STATUS = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    ALUMNI: 'alumni',
    PENDING: 'pending',
};

// Event Categories
export const EVENT_CATEGORIES = {
    WORKSHOP: 'workshop',
    TOURNAMENT: 'tournament',
    PRACTICE: 'practice',
    GUEST_LECTURE: 'guest_lecture',
    SOCIAL: 'social',
};

// Blog Categories
export const BLOG_CATEGORIES = [
    'Debate Tips',
    'Event Recap',
    'Member Stories',
    'Tournament Results',
    'Club News',
];

// Navigation Links
export const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    // { name: 'Members', path: '/members' },
    { name: 'Contact', path: '/contact' },
];
