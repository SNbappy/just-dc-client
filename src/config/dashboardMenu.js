// src/config/dashboardMenu.js

import {
    FaHome,
    FaUser,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaImages,
    FaUsers,
    FaUserShield,
    FaTasks,
} from 'react-icons/fa';

export const DASHBOARD_MENU = [
    // Everyone
    {
        key: 'home',
        label: 'Home',
        path: '/dashboard/home',
        icon: FaHome,
        roles: ['user', 'member', 'executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },
    {
        key: 'profile',
        label: 'My Profile',
        path: '/dashboard/profile',
        icon: FaUser,
        roles: ['user', 'member', 'executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },
    {
        key: 'payments',
        label: 'Payments',
        path: '/dashboard/payments',
        icon: FaMoneyBillWave,
        roles: ['user', 'member', 'executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },

    // Members & above
    {
        key: 'memberTasks',
        label: 'Member Tasks',
        path: '/dashboard/tasks',
        icon: FaTasks,
        roles: ['member', 'executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },

    // Executive & above
    {
        key: 'manageEvents',
        label: 'Manage Events',
        path: '/dashboard/manage/events',
        icon: FaCalendarAlt,
        roles: ['executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },
    {
        key: 'manageGallery',
        label: 'Manage Gallery',
        path: '/dashboard/manage/gallery',
        icon: FaImages,
        roles: ['executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },
    {
        key: 'manageMembers',
        label: 'Manage Members',
        path: '/dashboard/manage/members',
        icon: FaUsers,
        roles: ['executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },

    // Top management (Admin + President + GS)
    {
        key: 'manageUsers',
        label: 'User Management',
        path: '/dashboard/manage/users',
        icon: FaUserShield,
        roles: ['admin', 'president', 'general_secretary'],
    },
];