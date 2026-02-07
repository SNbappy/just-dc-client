import { useState, useEffect, useCallback } from 'react';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const testimonials = [
        // {
        //     id: 1,
        //     name: 'Ahmed Rahman',
        //     role: 'Former President',
        //     batch: 'Batch 2020',
        //     image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        //     text: 'JUST Debate Club transformed my university life. The skills I learned here—critical thinking, public speaking, and teamwork—have been invaluable in my professional career.',
        //     rating: 5,
        // },
        // {
        //     id: 2,
        //     name: 'Fatima Khan',
        //     role: 'Active Member',
        //     batch: 'Batch 2023',
        //     image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        //     text: 'Joining this club was the best decision I made at JUST. The supportive environment and amazing mentors helped me overcome my fear of public speaking.',
        //     rating: 5,
        // },
        // {
        //     id: 3,
        //     name: 'Shakib Hasan',
        //     role: 'Debate Champion',
        //     batch: 'Batch 2021',
        //     image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        //     text: 'The competitive spirit and camaraderie at JUST Debate Club pushed me to achieve things I never thought possible. Proud to be part of this legacy!',
        //     rating: 5,
        // },
        // {
        //     id: 4,
        //     name: 'Nusrat Jahan',
        //     role: 'General Secretary',
        //     batch: 'Batch 2022',
        //     image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
        //     text: 'The friendships and networks I built here are priceless. JUST Debate Club is more than an organization—it\'s a family that nurtures talent and builds leaders.',
        //     rating: 5,
        // },
        // {
        //     id: 5,
        //     name: 'Rafiul Islam',
        //     role: 'Tournament Winner',
        //     batch: 'Batch 2019',
        //     image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
        //     text: 'Winning the national championship with JUST Debate Club was a dream come true. The training, dedication, and support from our team made it all possible.',
        //     rating: 5,
        // },
        // {
        //     id: 6,
        //     name: 'Tasnuva Haque',
        //     role: 'Workshop Coordinator',
        //     batch: 'Batch 2024',
        //     image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
        //     text: 'The workshops and training sessions helped me develop confidence I never knew I had. I\'m grateful for every moment spent learning and growing here.',
        //     rating: 5,
        // },
        {
            id: 5,
            name: "Aruneka Haque Shamma",
            role: "Alumni",
            text: "নিজের অনেক স্বপ্নের ক্লাব কে যখন এতো সুন্দরভাবে এগিয়ে যেতে দেখি, দারুণ সব আয়োজন, অসংখ্য অর্জন দেখে কি যে শান্তি লাগে!!! অনেক শুভকামনা, ক্লাব এগিয়ে যাক বহুদূর",
            image: "Reviews/Aruneka.jpg",
        },
        {
            id: 6,
            name: "MD ATIF-UL-ISLAM NOOR",
            role: "Alumni",
            text: "যশোর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের বিতর্ক ক্লাব এমন একটি অংগন হিসেবে গড়ে উঠছে, যেখানে সবাই নিজস্ব মননশীলতার বহিঃপ্রকাশ ঘটিয়ে নিজেদেরকে উন্নত করছে এবং সুদুর ভবিষ্যতে দেশের যেকোন বিতর্ক অংগনকে ছাড়িয়ে দেশের মধ্যে একটি আলাদা নিজস্ব পরিচয় বহন করবে বলে আমি আশা ব্যক্ত করছি।",
            image: "Reviews/Atif.jpg",
        },
        // {
        //     name: "Mutaleb Hossain",
        //     position: "Organizing Secretary",
        //     text: "২০২২ সালে প্রথম বর্ষে যখন আমি বিশ্ববিদ্যালয়ে পা রাখি, তখন থেকেই যুক্তিবিদ্যার এই চর্চাগৃহে আমার যাত্রা শুরু হয়। যবিপ্রবি ডিবেট ক্লাব কেবল একটি সংগঠন নয়, এটি দক্ষতার এক প্রশিক্ষণ কেন্দ্র। যুক্তি, বিশ্লেষণ, বক্তৃতা—এসবের অনুশীলনের মাধ্যমে যে কেউ নিজেকে এক নতুন রূপে আবিষ্কার করতে পারে।",
        //     image: "Reviews/Mutaleb.jpg",
        // },
        {
            id: 1,
            name: "Nayem Zaman",
            role: "Alumni",
            text: "যুক্তি, চিন্তাশক্তি এবং আত্মবিশ্বাসের এক অনন্য মঞ্চ হলো JUST ডিবেট ক্লাব। এখানে বিতর্কগুলো সুচিন্তিত, আকর্ষণীয় এবং সমালোচনামূলক চিন্তাকে উৎসাহিত করে। আত্মবিশ্বাস তৈরি করতে এবং প্রভাবশালী বক্তা হতে চাইলে এই ক্লাবের অংশ হওয়া অবশ্যই দরকার!",
            image: "Reviews/Nayem.jpg",
        },
        // {
        //     id: 2,
        //     name: "Mostafijur Rahman",
        //     role: "IT Secretary",
        //     text: "ভার্সিটিতে এসে একমাত্র এই ক্লাবেই যুক্ত হয়েছি। আর জাস্টডিসি আমাকে কখনোই হতাশ করেনি। এই ক্লাবের ইভেন্ট ম্যানেজমেন্ট,অরগানাইজেশান,অ্যাডজুডিকেশন বরাবরই আমাকে মুগ্ধ করেছে এবং অন্যান্য ক্লাব থেকে এটাকে অনন্য করে তুলেছে। সর্বোপরি এই জাস্টডিসি কে আমি নিজে Own করি এবং এর উত্তরোত্তর সাফল্য কামনা করি।",
        //     image: "Reviews/Mostafij.jpg",
        // },
        {   id: 3,
            name: "Maisha Rahman",
            role: "Alumni",
            text: "জাস্ট ডিসি-র সাথে আমার সম্পর্কটা স্রেফ ভালবাসা এবং আবেগের। এই ক্লাবের সাথে থেকে যতকিছু শিখেছি, সেগুলো আমার সারাজীবনের সম্পদ এবং পথ চলার দিকনির্দেশনা। দোয়া করি প্রিয় জাস্ট ডিসি কে অনন্য উচ্চতায় নিয়ে যাবে স্নেহের অনুজেরা। ভাল থাকুক ভালোবাসার জাস্ট ডিসি।",
            image: "Reviews/maisha.jpg",
        },
        // {
        //     id: 4,
        //     name: "Shahbaz Ahmed",
        //     role: "Vice President",
        //     text: "ডিবেট ক্লাব কেবলমাত্র বিতার্কিকদের জন্যই নয়; এটি একটি সমন্বিত প্ল্যাটফর্ম, যেখানে গল্প, পরিকল্পনা এবং সৃষ্টিশীলতার একত্র অভিব্যক্তি ঘটে। প্রকাশনা, ডিজাইন কিংবা আয়োজন ব্যবস্থাপনায় আগ্রহী সদস্যদের আন্তরিক অংশগ্রহণই গঠন করে সংগঠনের ভিত। প্রতিটি সফল আয়োজনের অন্তরালে থাকে অনেক নিঃশব্দ প্রচেষ্টা ও গভীর নিষ্ঠা।",
        //     image: "Reviews/Ricky.jpg",
        // },
    ];

    // Define functions with useCallback to prevent re-creation
    const nextSlide = useCallback(() => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
            setTimeout(() => setIsAnimating(false), 500);
        }
    }, [isAnimating, testimonials.length]);

    const prevSlide = useCallback(() => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            setTimeout(() => setIsAnimating(false), 500);
        }
    }, [isAnimating, testimonials.length]);

    const goToSlide = useCallback((index) => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex(index);
            setTimeout(() => setIsAnimating(false), 500);
        }
    }, [isAnimating]);

    // Auto-advance testimonials
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000); // Change every 5 seconds

            return () => clearInterval(interval);
        }
    }, [isPaused, nextSlide]);

    // Get visible testimonials (current + next 2)
    const getVisibleTestimonials = () => {
        const visible = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % testimonials.length;
            visible.push({ ...testimonials[index], position: i });
        }
        return visible;
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">

            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary bg-opacity-10 text-primary font-semibold text-xs uppercase tracking-wider rounded-full mb-4">
                        Testimonials
                    </span>
                    <h2 className="font-heading font-bold text-5xl text-dark mb-4">
                        What Our Members Say
                    </h2>
                    <p className="text-gray text-lg max-w-2xl mx-auto">
                        Real experiences from our community members who have grown with us
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >

                    {/* Main Carousel Container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {getVisibleTestimonials().map((testimonial, idx) => (
                            <div
                                key={testimonial.id}
                                className={`transition-all duration-500 ${idx === 0 ? 'md:scale-105 md:z-10' : 'md:scale-95 md:opacity-75'
                                    }`}
                            >
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">

                                    {/* Quote Icon */}
                                    <div className="mb-6">
                                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-md">
                                            <FaQuoteLeft className="text-white text-xl" />
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FaStar key={i} className="text-yellow-400 text-lg" />
                                        ))}
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow text-base">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary ring-opacity-10"
                                        />
                                        <div>
                                            <h4 className="font-heading font-bold text-dark text-lg">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-primary text-sm font-semibold">
                                                {testimonial.role}
                                            </p>
                                            <p className="text-gray text-xs">
                                                {testimonial.batch}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 z-20"
                    >
                        <FaChevronLeft className="text-xl" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 z-20"
                    >
                        <FaChevronRight className="text-xl" />
                    </button>

                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-12">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${index === currentIndex
                                    ? 'w-8 h-3 bg-primary'
                                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>

                {/* Auto-play indicator */}
                {/* <div className="text-center mt-6">
                    <p className="text-gray text-sm">
                        {isPaused ? '⏸ Paused' : '▶ Auto-playing'} • Hover to pause
                    </p>
                </div> */}

            </div>
        </section>
    );
};

export default TestimonialsSection;
