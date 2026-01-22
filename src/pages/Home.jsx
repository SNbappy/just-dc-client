import Hero from '../components/common/Hero';
import LeadershipMessages from '../components/common/LeadershipMessages';
import EventsSection from '../components/common/EventsSection';
import StatsSection from '../components/common/StatsSection';
import GallerySection from '../components/gallery/GallerySection';
import TestimonialsSection from '../components/common/TestimonialsSection';

const Home = () => {
    return (
        <div>
            <Hero />
            <LeadershipMessages />
            <EventsSection />
            <StatsSection />
            <GallerySection />
            <TestimonialsSection />

            {/* More sections will be added here */}
        </div>
    );
};

export default Home;
