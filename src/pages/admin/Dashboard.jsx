import { FaUsers, FaCalendar, FaImages, FaTrophy, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Dashboard = () => {
    const stats = [
        {
            title: 'Total Members',
            value: '200',
            change: '+12',
            trend: 'up',
            icon: FaUsers,
            color: 'primary',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Upcoming Events',
            value: '8',
            change: '+3',
            trend: 'up',
            icon: FaCalendar,
            color: 'secondary',
            bgColor: 'bg-teal-100',
            iconColor: 'text-teal-600',
        },
        {
            title: 'Gallery Photos',
            value: '500+',
            change: '+45',
            trend: 'up',
            icon: FaImages,
            color: 'accent',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Tournaments Won',
            value: '50',
            change: '+2',
            trend: 'up',
            icon: FaTrophy,
            color: 'warning',
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
        },
    ];

    const recentActivities = [
        { id: 1, type: 'member', action: 'New member joined', name: 'Ahmed Khan', time: '2 hours ago' },
        { id: 2, type: 'event', action: 'Event created', name: 'Public Speaking Workshop', time: '5 hours ago' },
        { id: 3, type: 'gallery', action: 'Photos uploaded', name: '15 new photos', time: '1 day ago' },
        { id: 4, type: 'member', action: 'Member updated profile', name: 'Sarah Rahman', time: '2 days ago' },
        { id: 5, type: 'event', action: 'Event completed', name: 'Inter-University Debate', time: '3 days ago' },
    ];

    const upcomingEvents = [
        { id: 1, name: 'Inter-University Championship', date: 'Feb 15, 2026', participants: '12 Teams' },
        { id: 2, name: 'Public Speaking Workshop', date: 'Feb 08, 2026', participants: '50 Seats' },
        { id: 3, name: 'Weekly Practice Session', date: 'Jan 28, 2026', participants: 'All Members' },
    ];

    return (
        <div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading font-bold text-3xl text-dark mb-2">
                    Dashboard
                </h1>
                <p className="text-gray">
                    Welcome back! Here's what's happening with JUST Debate Club today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                <stat.icon className={`text-2xl ${stat.iconColor}`} />
                            </div>
                            <span className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray text-sm mb-1">{stat.title}</h3>
                        <p className="font-heading font-bold text-3xl text-dark">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading font-bold text-xl text-dark">
                            Recent Activities
                        </h2>
                        <button className="text-primary hover:text-primary-dark font-semibold text-sm">
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                                    {activity.type === 'member' && <FaUsers className="text-primary" />}
                                    {activity.type === 'event' && <FaCalendar className="text-primary" />}
                                    {activity.type === 'gallery' && <FaImages className="text-primary" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-dark">{activity.action}</p>
                                    <p className="text-gray text-sm">{activity.name}</p>
                                </div>
                                <span className="text-xs text-gray">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h2 className="font-heading font-bold text-xl text-dark mb-6">
                        Upcoming Events
                    </h2>

                    <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="p-4 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white"
                            >
                                <h3 className="font-semibold mb-2 line-clamp-2">{event.name}</h3>
                                <div className="flex items-center justify-between text-sm text-white text-opacity-90">
                                    <span>{event.date}</span>
                                    <span>{event.participants}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-3 bg-gray-100 text-dark font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                        View All Events
                    </button>
                </div>

            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="font-heading font-bold text-xl text-dark mb-6">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
                        <FaCalendar className="text-2xl mx-auto mb-2" />
                        <span className="text-sm font-semibold">Add Event</span>
                    </button>
                    <button className="p-4 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-colors">
                        <FaUsers className="text-2xl mx-auto mb-2" />
                        <span className="text-sm font-semibold">Add Member</span>
                    </button>
                    <button className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                        <FaImages className="text-2xl mx-auto mb-2" />
                        <span className="text-sm font-semibold">Upload Photos</span>
                    </button>
                    <button className="p-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors">
                        <FaChartLine className="text-2xl mx-auto mb-2" />
                        <span className="text-sm font-semibold">View Reports</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
