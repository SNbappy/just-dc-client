// config/dashboardMenu.js
import {
    FaHome,
    FaUser,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaImages,
    FaUsers,
    FaUserShield,
    FaTasks,
    FaCertificate,
    FaEnvelope,
    FaHistory,
    FaTicketAlt, // ✅ NEW
} from 'react-icons/fa';

export const DASHBOARD_MENU = [
    // ===================== EVERYONE =====================
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

    // ✅ NEW: My Registrations
    {
        key: 'registrations',
        label: 'My Registrations',
        path: '/dashboard/registrations',
        icon: FaTicketAlt,
        roles: ['user', 'member', 'executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },

    // ✅ My Certificates
    {
        key: 'certificates',
        label: 'My Certificates',
        path: '/dashboard/certificates',
        icon: FaCertificate,
        roles: ['user', 'member', 'executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },

    {
        key: 'payments',
        label: 'Payments',
        path: '/dashboard/payments',
        icon: FaMoneyBillWave,
        roles: ['user', 'member', 'executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },

    // ===================== MEMBERS & ABOVE =====================
    {
        key: 'memberTasks',
        label: 'Member Tasks',
        path: '/dashboard/tasks',
        icon: FaTasks,
        roles: ['member', 'executive_member', 'general_secretary', 'president', 'moderator', 'admin'],
    },

    // ===================== EXECUTIVE & ABOVE =====================
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

    // ===================== TOP MANAGEMENT =====================
    {
        key: 'composeEmail',
        label: 'Compose Email',
        path: '/dashboard/manage/compose-email',
        icon: FaEnvelope,
        roles: ['admin', 'president', 'general_secretary', 'moderator'],
    },
    {
        key: 'emailLogs',
        label: 'Email History',
        path: '/dashboard/manage/email-logs',
        icon: FaHistory,
        roles: ['admin', 'president', 'general_secretary', 'moderator'],
    },

    {
        key: 'manageUsers',
        label: 'User Management',
        path: '/dashboard/manage/users',
        icon: FaUserShield,
        roles: ['admin', 'president', 'general_secretary'],
    },
];

export const getAccessibleMenuItems = (userRole) => {
    if (!userRole) return [];
    return DASHBOARD_MENU.filter((item) => item.roles.includes(userRole));
};

export const hasAccessToRoute = (userRole, routePath) => {
    if (!userRole || !routePath) return false;
    const menuItem = DASHBOARD_MENU.find((item) => item.path === routePath);
    return menuItem ? menuItem.roles.includes(userRole) : false;
};

export const getMenuSections = (userRole) => {
    const accessibleItems = getAccessibleMenuItems(userRole);

    return {
        personal: accessibleItems.filter((item) =>
            ['home', 'profile', 'registrations', 'certificates', 'payments'].includes(item.key)
        ),
        member: accessibleItems.filter((item) =>
            ['memberTasks'].includes(item.key)
        ),
        management: accessibleItems.filter((item) =>
            ['manageEvents', 'manageGallery', 'manageMembers', 'composeEmail', 'emailLogs'].includes(item.key)
        ),
        administration: accessibleItems.filter((item) =>
            ['manageUsers'].includes(item.key)
        ),
    };
};
