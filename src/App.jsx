import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import EventsManagement from './pages/admin/EventsManagement';
import Members from './pages/admin/Members';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import GalleryManagement from './pages/admin/GalleryManagement';

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<EventsManagement />} />
        <Route path="members" element={<Members />} />
        <Route path="gallery" element={<GalleryManagement />} />
        <Route path="settings" element={<Dashboard />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="font-heading font-bold text-6xl text-primary mb-4">404</h1>
            <p className="text-xl text-gray mb-6">Page not found</p>
            <a href="/" className="btn-primary inline-block">
              Go Back Home
            </a>
          </div>
        </div>
      } />

    </Routes>
  );
}

export default App;
