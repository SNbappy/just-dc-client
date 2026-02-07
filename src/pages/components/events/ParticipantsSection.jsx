// src/components/events/ParticipantsSection.jsx
import { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const PARTICIPANT_ROLES = [
    { value: 'organizer', label: 'Organizer' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'core_adjudicator', label: 'Core Adjudicator' },
    { value: 'tab_team', label: 'Tab Team' },
    { value: 'speaker', label: 'Speaker' },
    { value: 'guest', label: 'Guest' },
];

const ParticipantsSection = ({ participants, onChange }) => {
    const [userSearch, setUserSearch] = useState('');
    const [userSearchLoading, setUserSearchLoading] = useState(false);
    const [userResults, setUserResults] = useState([]);

    // User search debounce
    useEffect(() => {
        const run = async () => {
            const q = userSearch.trim();
            if (!q) {
                setUserResults([]);
                return;
            }

            setUserSearchLoading(true);
            try {
                const res = await api.get('/users', { params: { search: q } });
                setUserResults(res?.data?.data || []);
            } catch (e) {
                console.error(e);
                setUserResults([]);
            } finally {
                setUserSearchLoading(false);
            }
        };

        const t = setTimeout(run, 300);
        return () => clearTimeout(t);
    }, [userSearch]);

    const addExternalParticipant = () => {
        const newParticipants = [
            ...participants,
            { role: 'volunteer', type: 'external', name: '', designation: '', org: '' },
        ];
        onChange(newParticipants);
    };

    const addInternalParticipant = (user) => {
        if (!user?.id) return;

        const exists = participants.some(
            (p) => p.type === 'internal' && String(p.userId) === String(user.id)
        );
        if (exists) {
            toast('User already added');
            return;
        }

        const newParticipants = [
            ...participants,
            { role: 'volunteer', type: 'internal', userId: user.id, user },
        ];
        onChange(newParticipants);
        toast.success('Added');
    };

    const updateParticipant = (idx, patch) => {
        const copy = [...participants];
        copy[idx] = { ...copy[idx], ...patch };
        onChange(copy);
    };

    const removeParticipant = (idx) => {
        const copy = [...participants];
        copy.splice(idx, 1);
        onChange(copy);
    };

    return (
        <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg text-dark flex items-center gap-2">
                        <FaUserPlus />
                        Event Team (Optional)
                    </h3>
                    <p className="text-sm text-gray mt-1">
                        Add organizers, volunteers, adjudicators, speakers, etc.
                    </p>
                </div>
            </div>

            {/* Search Internal Users */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-dark mb-2">
                    Search Club Members
                </label>
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search by name, email, or student ID..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                </div>

                {/* Search Results */}
                {userSearch && userResults.length > 0 && (
                    <div className="mt-2 bg-white border-2 border-gray-200 rounded-xl max-h-60 overflow-y-auto">
                        {userResults.map((u) => (
                            <button
                                key={u.id || u._id}
                                type="button"
                                onClick={() => addInternalParticipant(u)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                                <div className="font-semibold text-dark">{u.name}</div>
                                <div className="text-sm text-gray">{u.email}</div>
                                {u.studentId && (
                                    <div className="text-xs text-gray">ID: {u.studentId}</div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {userSearch && !userSearchLoading && userResults.length === 0 && (
                    <div className="mt-2 text-sm text-gray text-center py-3">No users found</div>
                )}
            </div>

            {/* Add External Button */}
            <button
                type="button"
                onClick={addExternalParticipant}
                className="mb-4 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 flex items-center gap-2"
            >
                <FaUserPlus />
                Add External Participant
            </button>

            {/* Participants List */}
            {participants.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <FaUserPlus className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray text-sm">No team members added yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {participants.map((p, idx) => {
                        const isInternal = p.type === 'internal';
                        return (
                            <div
                                key={idx}
                                className="bg-gray-50 rounded-xl p-4 flex items-start gap-4"
                            >
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Role */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray mb-1">
                                            Role
                                        </label>
                                        <select
                                            value={p.role}
                                            onChange={(e) =>
                                                updateParticipant(idx, { role: e.target.value })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none text-sm"
                                        >
                                            {PARTICIPANT_ROLES.map((r) => (
                                                <option key={r.value} value={r.value}>
                                                    {r.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="flex items-end">
                                        <span
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold ${isInternal
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {isInternal
                                                ? `Internal: ${p.user?.name || 'Member'}`
                                                : 'External'}
                                        </span>
                                    </div>

                                    {/* External fields */}
                                    {!isInternal && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray mb-1">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={p.name || ''}
                                                    onChange={(e) =>
                                                        updateParticipant(idx, { name: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none text-sm"
                                                    placeholder="Full name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray mb-1">
                                                    Designation
                                                </label>
                                                <input
                                                    type="text"
                                                    value={p.designation || ''}
                                                    onChange={(e) =>
                                                        updateParticipant(idx, {
                                                            designation: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none text-sm"
                                                    placeholder="e.g., Professor, Adjudicator"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-gray mb-1">
                                                    Organization
                                                </label>
                                                <input
                                                    type="text"
                                                    value={p.org || ''}
                                                    onChange={(e) =>
                                                        updateParticipant(idx, { org: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none text-sm"
                                                    placeholder="e.g., JUST, DU"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeParticipant(idx)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ParticipantsSection;
