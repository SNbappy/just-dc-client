import { FaLinkedin, FaFacebook, FaEnvelope } from 'react-icons/fa';

const ExecutiveCommittee = () => {
    const executives = [
        {
            name: 'John Doe',
            position: 'President',
            department: 'Computer Science & Engineering',
            batch: 'Batch 2021',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            linkedin: '#',
            facebook: '#',
            email: 'john@example.com',
        },
        {
            name: 'Jane Smith',
            position: 'General Secretary',
            department: 'Electrical & Electronic Engineering',
            batch: 'Batch 2021',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            linkedin: '#',
            facebook: '#',
            email: 'jane@example.com',
        },
        {
            name: 'Ahmed Khan',
            position: 'Vice President',
            department: 'Civil Engineering',
            batch: 'Batch 2022',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
            linkedin: '#',
            facebook: '#',
            email: 'ahmed@example.com',
        },
        {
            name: 'Sarah Rahman',
            position: 'Treasurer',
            department: 'Business Administration',
            batch: 'Batch 2022',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
            linkedin: '#',
            facebook: '#',
            email: 'sarah@example.com',
        },
        {
            name: 'Karim Hassan',
            position: 'Organizing Secretary',
            department: 'Mechanical Engineering',
            batch: 'Batch 2022',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
            linkedin: '#',
            facebook: '#',
            email: 'karim@example.com',
        },
        {
            name: 'Fatima Ahmed',
            position: 'Training Coordinator',
            department: 'English',
            batch: 'Batch 2023',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
            linkedin: '#',
            facebook: '#',
            email: 'fatima@example.com',
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-accent bg-opacity-10 text-accent font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                        Our Team
                    </span>
                    <h2 className="font-heading font-bold text-5xl text-dark mb-4">
                        Executive Committee 2023-2024
                    </h2>
                    <p className="text-gray text-lg max-w-2xl mx-auto">
                        Meet the dedicated leaders driving our vision forward
                    </p>
                </div>

                {/* Executive Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {executives.map((executive, index) => (
                        <div
                            key={index}
                            className="group bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
                        >

                            {/* Image */}
                            <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary to-secondary">
                                <img
                                    src={executive.image}
                                    alt={executive.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                                        <a
                                            href={executive.linkedin}
                                            className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                        >
                                            <FaLinkedin className="text-lg" />
                                        </a>
                                        <a
                                            href={executive.facebook}
                                            className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                        >
                                            <FaFacebook className="text-lg" />
                                        </a>
                                        <a
                                            href={`mailto:${executive.email}`}
                                            className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                        >
                                            <FaEnvelope className="text-lg" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <div className="mb-2">
                                    <span className="inline-block px-3 py-1 bg-primary bg-opacity-10 text-primary text-xs font-semibold rounded-full">
                                        {executive.position}
                                    </span>
                                </div>

                                <h3 className="font-heading font-bold text-xl text-dark mb-2">
                                    {executive.name}
                                </h3>

                                <p className="text-gray text-sm mb-1">
                                    {executive.department}
                                </p>

                                <p className="text-gray-400 text-xs">
                                    {executive.batch}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ExecutiveCommittee;
