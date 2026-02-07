import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { HiArrowRight, HiUsers, HiCalendar, HiStar } from 'react-icons/hi';

// Compact Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '+', label, icon: Icon, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const counterRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    setTimeout(() => {
                        const startTime = Date.now();
                        const endValue = parseInt(end);

                        const updateCounter = () => {
                            const now = Date.now();
                            const progress = Math.min((now - startTime) / duration, 1);

                            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                            const currentCount = Math.floor(easeOutQuart * endValue);

                            setCount(currentCount);

                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                setCount(endValue);
                            }
                        };

                        updateCounter();
                    }, delay);
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated, delay]);

    return (
        <div
            ref={counterRef}
            className="group relative bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl p-5 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-xl"
        >
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-2xl text-yellow-300" />
                </div>

                {/* Counter and Label */}
                <div className="flex-1">
                    <div className="flex items-baseline gap-1">
                        <span className="font-heading font-extrabold text-4xl text-white">
                            {count}
                        </span>
                        <span className="font-heading font-bold text-2xl text-yellow-300">
                            {suffix}
                        </span>
                    </div>
                    <p className="text-gray-200 font-medium text-sm mt-0.5">{label}</p>
                </div>
            </div>
        </div>
    );
};

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        '/Slider/Slide1.webp',
        '/Slider/Slide2.webp',
        '/Slider/Slide3.webp',
        '/Slider/Slide4.webp',
        '/Slider/Slide5.webp',
        '/Slider/Slide6.webp'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const stats = [
        { end: '250', label: 'Active Members', icon: HiUsers, delay: 0 },
        { end: '50', label: 'Events Hosted', icon: HiCalendar, delay: 200 },
        { end: '20', label: 'Awards Won', icon: HiStar, delay: 400 },
    ];

    return (
        <section className="relative min-h-[700px] flex items-center overflow-hidden">
            {/* Background Slideshow */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={slide}
                            alt={`JUST Debate Club ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Gradient Overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/85 to-secondary/90"></div> */}

            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="text-white space-y-6">
                        <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-tight drop-shadow-2xl">
                            Empower Your Voice Through{' '}
                            <span className="text-yellow-300 inline-block animate-pulse" style={{ animationDuration: '2s' }}>
                                Debate
                            </span>
                        </h1>

                        <div className="h-1 w-24 bg-yellow-300 rounded-full"></div>

                        <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-xl drop-shadow-lg">
                            Join JUST Debate Club and develop critical thinking, public speaking, and leadership skills.
                            Shape your future through the art of persuasive argumentation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                to="/register"
                                variant="secondary"
                                className="text-lg px-8 py-4 shadow-2xl hover:scale-105 transition-transform"
                            >
                                Join Us Today <HiArrowRight className="inline ml-2" />
                            </Button>
                            <Button
                                to="/events"
                                variant="outline"
                                className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black hover:text-primary shadow-xl hover:scale-105 transition-transform"
                            >
                                Upcoming Events
                            </Button>
                        </div>
                    </div>

                    {/* Right Content - Compact Counters */}
                    {/* Right Content - Compact Counters */}
                    <div className="space-y-4 max-w-sm ml-auto">
                        {stats.map((stat, index) => (
                            <AnimatedCounter
                                key={index}
                                end={stat.end}
                                label={stat.label}
                                icon={stat.icon}
                                delay={stat.delay}
                            />
                        ))}
                    </div>


                </div>
            </div>

            {/* Bottom Wave Decoration */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F3F4F6" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
