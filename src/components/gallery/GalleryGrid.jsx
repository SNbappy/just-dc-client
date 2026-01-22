import { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

const GalleryGrid = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const categories = ['all', 'Tournaments', 'Workshops', 'Practice Sessions', 'Social Events', 'Achievements'];

    const images = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1540317580384-e5d43616d00b?w=800&h=600&fit=crop',
            title: 'Inter-University Debate Championship 2025',
            category: 'Tournaments',
            date: 'December 2025',
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
            title: 'Team Strategy Session',
            category: 'Practice Sessions',
            date: 'November 2025',
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop',
            title: 'Public Speaking Workshop',
            category: 'Workshops',
            date: 'October 2025',
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=800&h=600&fit=crop',
            title: 'National Debate Competition',
            category: 'Tournaments',
            date: 'September 2025',
        },
        {
            id: 5,
            url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
            title: 'Annual Cultural Night',
            category: 'Social Events',
            date: 'August 2025',
        },
        {
            id: 6,
            url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
            title: 'Executive Committee Meeting',
            category: 'Social Events',
            date: 'July 2025',
        },
        {
            id: 7,
            url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
            title: 'Championship Trophy Ceremony',
            category: 'Achievements',
            date: 'June 2025',
        },
        {
            id: 8,
            url: 'https://images.unsplash.com/photo-1559223607-a43c990c18b0?w=800&h=600&fit=crop',
            title: 'Training Workshop for Freshers',
            category: 'Workshops',
            date: 'May 2025',
        },
        {
            id: 9,
            url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
            title: 'Victory Celebration',
            category: 'Achievements',
            date: 'April 2025',
        },
        {
            id: 10,
            url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop',
            title: 'Weekly Practice Debate',
            category: 'Practice Sessions',
            date: 'March 2025',
        },
        {
            id: 11,
            url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
            title: 'Regional Tournament Finals',
            category: 'Tournaments',
            date: 'February 2025',
        },
        {
            id: 12,
            url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
            title: 'Team Building Retreat',
            category: 'Social Events',
            date: 'January 2025',
        },
    ];

    const filteredImages = selectedCategory === 'all'
        ? images
        : images.filter(img => img.category === selectedCategory);

    const openLightbox = (image, index) => {
        setSelectedImage(image);
        setCurrentIndex(index);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const nextIndex = (currentIndex + 1) % filteredImages.length;
        setCurrentIndex(nextIndex);
        setSelectedImage(filteredImages[nextIndex]);
    };

    const prevImage = () => {
        const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setCurrentIndex(prevIndex);
        setSelectedImage(filteredImages[prevIndex]);
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Category Filter */}
                <div className="mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <h2 className="font-heading font-bold text-3xl text-dark">Browse by Category</h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedCategory === category
                                        ? 'bg-primary text-white shadow-lg scale-105'
                                        : 'bg-white text-gray border border-gray-200 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {category === 'all' ? 'All Photos' : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-8 text-center">
                    <p className="text-gray text-lg">
                        Showing <span className="font-bold text-dark">{filteredImages.length}</span> photo{filteredImages.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Gallery Grid */}
                {filteredImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredImages.map((image, index) => (
                            <div
                                key={image.id}
                                className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square bg-gray-200"
                                onClick={() => openLightbox(image, index)}
                            >
                                {/* Image */}
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FaExpand className="text-white text-3xl" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-2">
                                            {image.category}
                                        </span>
                                        <h3 className="text-white font-heading font-bold text-sm line-clamp-2">
                                            {image.title}
                                        </h3>
                                        <p className="text-white text-opacity-80 text-xs mt-1">
                                            {image.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📷</div>
                        <h3 className="font-heading font-bold text-2xl text-dark mb-2">No Photos Found</h3>
                        <p className="text-gray">Try selecting a different category</p>
                    </div>
                )}

            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-50"
                        onClick={closeLightbox}
                    >
                        <FaTimes />
                    </button>

                    {/* Previous Button */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                    >
                        <FaChevronLeft className="text-2xl" />
                    </button>

                    {/* Next Button */}
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                    >
                        <FaChevronRight className="text-2xl" />
                    </button>

                    {/* Image Container */}
                    <div
                        className="max-w-6xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="w-full h-auto rounded-lg"
                        />
                        <div className="text-center mt-6">
                            <span className="inline-block px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full mb-3">
                                {selectedImage.category}
                            </span>
                            <h3 className="text-white font-heading font-bold text-2xl mb-2">
                                {selectedImage.title}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {selectedImage.date} • {currentIndex + 1} / {filteredImages.length}
                            </p>
                        </div>
                    </div>

                </div>
            )}

        </section>
    );
};

export default GalleryGrid;
