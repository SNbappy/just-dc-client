import { Routes, Route, Navigate } from 'react-router-dom';

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

// Payment Pages
import Payments from './pages/Payments';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import PaymentCancelled from './pages/PaymentCancelled';

// Profile Page
import Profile from './pages/Profile';

// Admin Pages
import DashboardHome from './pages/admin/DashboardHome';
import EventsManagement from './pages/admin/EventsManagement';
import Members from './pages/admin/Members';
import GalleryManagement from './pages/admin/GalleryManagement';
import UserManagement from './pages/admin/UserManagement';
import PaymentManagement from './pages/admin/PaymentManagement';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

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

        {/* ✅ User Profile (protected, for ALL roles) */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Payment Routes */}
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="/payment-cancelled" element={<PaymentCancelled />} />

      {/* ✅ Common Dashboard entry for ALL logged-in users */}
      {/* For now, redirect dashboard -> profile (we'll replace with real user dashboard layout next step) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard/home" replace />
          </ProtectedRoute>
        }
      />

      {/* ✅ Placeholder dashboard home for now (we will build real dashboard pages next step) */}
      <Route
        path="/dashboard/home"
        element={
          <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
              <div className="bg-white rounded-xl shadow-md p-8 max-w-xl w-full">
                <h2 className="text-2xl font-bold text-dark mb-3">User Dashboard</h2>
                <p className="text-gray">
                  Dashboard layout + role-based menus are coming next step.
                </p>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <a href="/profile" className="btn-primary inline-block">
                    Go to Profile
                  </a>
                  <a href="/payments" className="btn-outline inline-block">
                    Payments
                  </a>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes - Protected by Role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'president', 'general_secretary', 'moderator']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="events" element={<EventsManagement />} />
        <Route path="members" element={<Members />} />
        <Route path="gallery" element={<GalleryManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="payments" element={<PaymentManagement />} />

        {/* ✅ Real profile page inside admin layout */}
        <Route path="profile" element={<Profile />} />

        <Route path="settings" element={<DashboardHome />} />
      </Route>

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="font-heading font-bold text-6xl text-primary mb-4">404</h1>
              <p className="text-xl text-gray mb-6">Page not found</p>
              <a href="/" className="btn-primary inline-block">
                Go Back Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
