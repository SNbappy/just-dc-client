import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import api from '../../services/api';

const GalleryGrid = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allImages, setAllImages] = useState([]);

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            setLoading(true);
            const response = await api.get('/gallery?isPublished=true');
            const galleriesData = response.data.data || [];
            setGalleries(galleriesData);

            // Flatten all images from all galleries
            const flatImages = galleriesData.flatMap(gallery =>
                gallery.images.map(image => ({
                    id: image._id,
                    url: image.url,
                    title: gallery.title,
                    category: gallery.category,
                    date: gallery.eventDate ? new Date(gallery.eventDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
                    caption: image.caption || '',
                }))
            );
            setAllImages(flatImages);
        } catch (error) {
            console.error('Error fetching galleries:', error);
            setGalleries([]);
            setAllImages([]);
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories from galleries
    const categories = ['all', ...new Set(galleries.map(g => g.category))];

    const filteredImages = selectedCategory === 'all'
        ? allImages
        : allImages.filter(img => img.category === selectedCategory);

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

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (selectedImage) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedImage, currentIndex]);

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                </div>
            </section>
        );
    }

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
                                className={`px-6 py-3 rounded-xl font-semibold transition-all capitalize ${selectedCategory === category
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
                                        {image.date && (
                                            <p className="text-white text-opacity-80 text-xs mt-1">
                                                {image.date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📷</div>
                        <h3 className="font-heading font-bold text-2xl text-dark mb-2">No Photos Found</h3>
                        <p className="text-gray">
                            {selectedCategory === 'all'
                                ? 'No photos have been uploaded yet.'
                                : `No photos found in ${selectedCategory} category.`}
                        </p>
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
                            <span className="inline-block px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full mb-3 capitalize">
                                {selectedImage.category}
                            </span>
                            <h3 className="text-white font-heading font-bold text-2xl mb-2">
                                {selectedImage.title}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {selectedImage.date && `${selectedImage.date} • `}
                                {currentIndex + 1} / {filteredImages.length}
                            </p>
                            {selectedImage.caption && (
                                <p className="text-gray-400 text-sm mt-2">
                                    {selectedImage.caption}
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            )}

        </section>
    );
};

export default GalleryGrid;
