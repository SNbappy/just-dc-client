import Hero from '../components/common/Hero';
import LeadershipMessages from '../components/common/LeadershipMessages';
import EventsSection from '../components/common/EventsSection';
import StatsSection from '../components/common/StatsSection';

const Home = () => {
    return (
        <div>
            <Hero />
            <LeadershipMessages />
            <EventsSection />
            <StatsSection />

            {/* More sections will be added here */}
        </div>
    );
};

export default Home;
