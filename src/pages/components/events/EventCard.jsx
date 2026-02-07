// src/components/events/EventCard.jsx
import { FaCalendar, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaUsers, FaList } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onEdit, onDelete }) => {
    const eventId = event.id ?? event._id;

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-primary to-secondary relative">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FaCalendar className="text-6xl text-white opacity-50" />
                    </div>
                )}

                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <span className="px-3 py-1 bg-white text-primary text-sm font-semibold rounded-full">
                        {event.category}
                    </span>

                    {event.categories && event.categories.length > 0 && (
                        <span className="px-3 py-1 bg-white text-dark text-sm font-semibold rounded-full flex items-center gap-2">
                            <FaList />
                            {event.categories.length} {event.categories.length === 1 ? 'Category' : 'Categories'}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6">
                <h3 className="font-heading font-bold text-xl text-dark mb-3 line-clamp-2">
                    {event.title}
                </h3>

                <p className="text-gray text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray text-sm">
                        <FaCalendar className="text-primary" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                    <div className="flex items-center gap-2 text-gray text-sm">
                        <FaClock className="text-primary" />
                        {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray text-sm">
                        <FaMapMarkerAlt className="text-primary" />
                        {event.location}
                    </div>
                </div>

                <div className="mb-3">
                    <Link
                        to={`/dashboard/manage/events/${eventId}/participants`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark text-white font-semibold rounded-xl hover:opacity-90 transition"
                    >
                        <FaUsers />
                        Participants & Certificates
                    </Link>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(event)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-xl hover:bg-blue-200 transition-colors"
                    >
                        <FaEdit />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(eventId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
                    >
                        <FaTrash />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
