export const ROLE_PERMISSIONS = {
    user: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments'
    ],

    member: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks'
    ],

    executive_member: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members'
    ],

    moderator: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members'
    ],

    general_secretary: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members',
        'manage.users'
    ],

    president: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members',
        'manage.users'
    ],

    admin: [
        'dashboard.home',
        'dashboard.profile',
        'dashboard.payments',
        'dashboard.tasks',
        'manage.events',
        'manage.gallery',
        'manage.members',
        'manage.users'
    ]
};
