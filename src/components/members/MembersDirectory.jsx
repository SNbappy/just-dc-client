import { useState } from 'react';
import { FaSearch, FaLinkedin, FaFacebook, FaEnvelope, FaTrophy, FaFilter } from 'react-icons/fa';

const MembersDirectory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedRole, setSelectedRole] = useState('all');

    const members = [
        {
            id: 1,
            name: 'John Doe',
            role: 'President',
            batch: '2021',
            department: 'Computer Science & Engineering',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            achievements: 'National Champion 2024, Best Speaker 2023',
            linkedin: '#',
            facebook: '#',
            email: 'john@example.com',
        },
        {
            id: 2,
            name: 'Jane Smith',
            role: 'General Secretary',
            batch: '2021',
            department: 'Electrical & Electronic Engineering',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            achievements: 'Regional Champion 2024',
            linkedin: '#',
            facebook: '#',
            email: 'jane@example.com',
        },
        {
            id: 3,
            name: 'Ahmed Khan',
            role: 'Vice President',
            batch: '2022',
            department: 'Civil Engineering',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
            achievements: 'Best Debater 2023',
            linkedin: '#',
            facebook: '#',
            email: 'ahmed@example.com',
        },
        {
            id: 4,
            name: 'Sarah Rahman',
            role: 'Treasurer',
            batch: '2022',
            department: 'Business Administration',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
            achievements: 'Inter-University Champion 2024',
            linkedin: '#',
            facebook: '#',
            email: 'sarah@example.com',
        },
        {
            id: 5,
            name: 'Karim Hassan',
            role: 'Executive Member',
            batch: '2022',
            department: 'Mechanical Engineering',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
            achievements: 'Tournament Organizer of the Year',
            linkedin: '#',
            facebook: '#',
            email: 'karim@example.com',
        },
        {
            id: 6,
            name: 'Fatima Ahmed',
            role: 'Training Coordinator',
            batch: '2023',
            department: 'English',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
            achievements: 'Best Newcomer 2023',
            linkedin: '#',
            facebook: '#',
            email: 'fatima@example.com',
        },
        {
            id: 7,
            name: 'Rahul Islam',
            role: 'Member',
            batch: '2023',
            department: 'Physics',
            image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
            achievements: 'Debater of the Month - Oct 2023',
            linkedin: '#',
            facebook: '#',
            email: 'rahul@example.com',
        },
        {
            id: 8,
            name: 'Nadia Hossain',
            role: 'Member',
            batch: '2024',
            department: 'Computer Science & Engineering',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
            achievements: 'Freshers Champion 2024',
            linkedin: '#',
            facebook: '#',
            email: 'nadia@example.com',
        },
    ];

    const batches = ['all', '2021', '2022', '2023', '2024'];
    const departments = ['all', 'Computer Science & Engineering', 'Electrical & Electronic Engineering', 'Civil Engineering', 'Business Administration', 'Mechanical Engineering', 'English', 'Physics'];
    const roles = ['all', 'President', 'General Secretary', 'Vice President', 'Treasurer', 'Training Coordinator', 'Executive Member', 'Member'];

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBatch = selectedBatch === 'all' || member.batch === selectedBatch;
        const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
        const matchesRole = selectedRole === 'all' || member.role === selectedRole;

        return matchesSearch && matchesBatch && matchesDepartment && matchesRole;
    });

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search Bar */}
                <div className="mb-12">
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Search by name or department..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none text-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <FaFilter className="text-primary" />
                        <h3 className="font-heading font-bold text-2xl text-dark">Filter Members</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Batch Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray mb-2">Batch</label>
                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                            >
                                {batches.map(batch => (
                                    <option key={batch} value={batch}>
                                        {batch === 'all' ? 'All Batches' : `Batch ${batch}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray mb-2">Department</label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>
                                        {dept === 'all' ? 'All Departments' : dept}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray mb-2">Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>
                                        {role === 'all' ? 'All Roles' : role}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Reset Filters Button */}
                    {(searchTerm || selectedBatch !== 'all' || selectedDepartment !== 'all' || selectedRole !== 'all') && (
                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedBatch('all');
                                    setSelectedDepartment('all');
                                    setSelectedRole('all');
                                }}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-8">
                    <p className="text-gray text-lg">
                        Showing <span className="font-bold text-dark">{filteredMembers.length}</span> member{filteredMembers.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Members Grid */}
                {filteredMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
                            >

                                {/* Member Image */}
                                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-primary to-secondary">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Role Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                                        {member.role}
                                    </div>

                                    {/* Social Links Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                                            <a
                                                href={member.linkedin}
                                                className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                            >
                                                <FaLinkedin className="text-lg" />
                                            </a>
                                            <a
                                                href={member.facebook}
                                                className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                            >
                                                <FaFacebook className="text-lg" />
                                            </a>
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                            >
                                                <FaEnvelope className="text-lg" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Member Info */}
                                <div className="p-6">
                                    <h3 className="font-heading font-bold text-xl text-dark mb-1">
                                        {member.name}
                                    </h3>

                                    <p className="text-secondary text-sm font-semibold mb-2">
                                        Batch {member.batch}
                                    </p>

                                    <p className="text-gray text-sm mb-4 line-clamp-2">
                                        {member.department}
                                    </p>

                                    {/* Achievements */}
                                    {member.achievements && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex items-start gap-2">
                                                <FaTrophy className="text-primary text-sm mt-0.5 flex-shrink-0" />
                                                <p className="text-gray text-xs line-clamp-2">
                                                    {member.achievements}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="font-heading font-bold text-2xl text-dark mb-2">No Members Found</h3>
                        <p className="text-gray">Try adjusting your search or filters</p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default MembersDirectory;
