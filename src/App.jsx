import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import UserDashboardLayout from './layouts/UserDashboardLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Payment Pages
import Payments from './pages/Payments';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import PaymentCancelled from './pages/PaymentCancelled';

// Profile
import Profile from './pages/Profile';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';

// Management Pages (role-gated inside dashboard)
import EventsManagement from './pages/admin/EventsManagement';
import Members from './pages/admin/Members';
import GalleryManagement from './pages/admin/GalleryManagement';
import UserManagement from './pages/admin/UserManagement';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleGate from './components/common/RoleGate';

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />

        {/* Events list + details */}
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />

        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* ================= AUTH ROUTES ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= PAYMENTS ROUTES ================= */}
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

      {/* ================= USER DASHBOARD ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard route */}
        <Route index element={<Navigate to="/dashboard/home" replace />} />

        {/* Dashboard Pages */}
        <Route
          path="home"
          element={
            <RoleGate permission="dashboard.home">
              <DashboardHome />
            </RoleGate>
          }
        />

        <Route
          path="profile"
          element={
            <RoleGate permission="dashboard.profile">
              <Profile />
            </RoleGate>
          }
        />

        <Route
          path="payments"
          element={
            <RoleGate permission="dashboard.payments">
              <Payments />
            </RoleGate>
          }
        />

        <Route
          path="tasks"
          element={
            <RoleGate permission="dashboard.tasks">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold">Member Tasks</h2>
                <p className="text-gray mt-2">Coming soon...</p>
              </div>
            </RoleGate>
          }
        />

        {/* Management Pages */}
        <Route
          path="manage/events"
          element={
            <RoleGate permission="manage.events">
              <EventsManagement />
            </RoleGate>
          }
        />

        <Route
          path="manage/gallery"
          element={
            <RoleGate permission="manage.gallery">
              <GalleryManagement />
            </RoleGate>
          }
        />

        <Route
          path="manage/members"
          element={
            <RoleGate permission="manage.members">
              <Members />
            </RoleGate>
          }
        />

        <Route
          path="manage/users"
          element={
            <RoleGate permission="manage.users">
              <UserManagement />
            </RoleGate>
          }
        />

        {/* If inside dashboard user hits unknown route */}
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <p className="text-gray mb-6">Page not found</p>
              <a href="/" className="btn-primary">
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
