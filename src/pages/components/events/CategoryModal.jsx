// src/components/events/CategoryModal.jsx
import { FaTimes } from 'react-icons/fa';

const CategoryModal = ({
    show,
    onClose,
    formData,
    onChange,
    onSave,
    isEditing
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="font-heading font-bold text-2xl text-dark">
                        {isEditing ? 'Edit Category' : 'Add Registration Category'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-dark transition-colors">
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Category Name */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Category Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                            placeholder="e.g., Debater, Adjudicator, Speaker"
                        />
                        <p className="text-xs text-gray mt-1">
                            This is what participants will see when registering
                        </p>
                    </div>

                    {/* Registration Type */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Registration Type *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        >
                            <option value="individual">Individual</option>
                            <option value="team">Team</option>
                        </select>
                    </div>

                    {/* Team Size (only if type is team) */}
                    {formData.type === 'team' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Min Team Size *
                                </label>
                                <input
                                    type="number"
                                    name="teamMin"
                                    value={formData.teamMin}
                                    onChange={onChange}
                                    min="2"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                    placeholder="2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-dark mb-2">
                                    Max Team Size *
                                </label>
                                <input
                                    type="number"
                                    name="teamMax"
                                    value={formData.teamMax}
                                    onChange={onChange}
                                    min={formData.teamMin || 2}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                    placeholder="4"
                                />
                            </div>
                        </div>
                    )}

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Registration Fee (৳)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={onChange}
                            min="0"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                            placeholder="0"
                        />
                        <p className="text-xs text-gray mt-1">Set to 0 for free registration</p>
                    </div>

                    {/* Capacity */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">
                            Capacity ({formData.type === 'team' ? 'teams' : 'people'})
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={onChange}
                            min="1"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                            placeholder="Leave empty for unlimited"
                        />
                        <p className="text-xs text-gray mt-1">Leave empty for unlimited capacity</p>
                    </div>

                    {/* Access Type */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-2">Who Can Register? *</label>
                        <select
                            name="accessType"
                            value={formData.accessType}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                        >
                            <option value="all">Everyone (Public + Logged In)</option>
                            <option value="registered_only">Registered Users Only</option>
                            <option value="members_only">Club Members Only</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                        >
                            {isEditing ? 'Update Category' : 'Add Category'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
