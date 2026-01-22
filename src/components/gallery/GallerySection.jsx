import { useState } from 'react';
import { HiX } from 'react-icons/hi';

const GallerySection = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const images = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1540317580384-e5d43616d00b?w=800&h=600&fit=crop',
            title: 'Annual Debate Championship 2025',
            category: 'Tournament',
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
            title: 'Team Practice Session',
            category: 'Practice',
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop',
            title: 'Public Speaking Workshop',
            category: 'Workshop',
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=800&h=600&fit=crop',
            title: 'Inter-University Competition',
            category: 'Tournament',
        },
        {
            id: 5,
            url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
            title: 'Guest Speaker Event',
            category: 'Event',
        },
        {
            id: 6,
            url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
            title: 'Executive Committee Meeting',
            category: 'Meeting',
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 bg-accent bg-opacity-10 text-accent font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                        Gallery
                    </span>
                    <h2 className="font-heading font-bold text-5xl text-dark mb-4">
                        Moments Worth Sharing
                    </h2>
                    <p className="text-gray text-lg max-w-2xl mx-auto">
                        Capturing the spirit, passion, and memories of our debate community
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3]"
                            onClick={() => setSelectedImage(image)}
                        >
                            {/* Image */}
                            <img
                                src={image.url}
                                alt={image.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="inline-block px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-2">
                                        {image.category}
                                    </span>
                                    <h3 className="text-white font-heading font-bold text-lg">
                                        {image.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-12">
                    <button className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg">
                        View Full Gallery
                    </button>
                </div>

            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <HiX />
                    </button>
                    <div className="max-w-5xl w-full">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="w-full h-auto rounded-lg"
                        />
                        <div className="text-center mt-6">
                            <span className="inline-block px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-2">
                                {selectedImage.category}
                            </span>
                            <h3 className="text-white font-heading font-bold text-2xl">
                                {selectedImage.title}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default GallerySection;