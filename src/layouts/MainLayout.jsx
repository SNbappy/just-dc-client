import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-light">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
