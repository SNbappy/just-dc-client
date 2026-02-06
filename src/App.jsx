// src/App.jsx - COMPLETE VERSION
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import UserDashboardLayout from "./layouts/UserDashboardLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyCertificate from "./pages/VerifyCertificate";

// ✅ NEW: Registration Pages
import EventRegistration from "./pages/EventRegistrations";
import TrackRegistration from "./pages/TrackRegistration";

// Payment Pages
import Payments from "./pages/Payments";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentCancelled from "./pages/PaymentCancelled";

// Profile
import Profile from "./pages/Profile";

// Dashboard Pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import MyCertificates from "./pages/dashboard/MyCertificates";
import MyRegistrations from "./pages/dashboard/MyRegistrations"; // ✅ NEW

// Management Pages
import EventsManagement from "./pages/admin/EventsManagement";
import EventParticipants from "./pages/admin/EventParticipants";
import Members from "./pages/admin/Members";
import GalleryManagement from "./pages/admin/GalleryManagement";
import UserManagement from "./pages/admin/UserManagement";

// Email System
import ComposeEmail from './pages/admin/ComposeEmail';
import EmailLogs from './pages/admin/EmailLogs';

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleGate from "./components/common/RoleGate";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="verify-certificate" element={<VerifyCertificate />} />

        {/* ✅ NEW: Track Registration (Public) */}
        <Route path="track-registration" element={<TrackRegistration />} />
      </Route>

      {/* ================= AUTH ROUTES ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ✅ NEW: EVENT REGISTRATION (Outside Main Layout) ================= */}
      <Route path="/events/:eventId/register" element={<EventRegistration />} />

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
        {/* Redirect /dashboard to /dashboard/home */}
        <Route index element={<Navigate to="/dashboard/home" replace />} />

        {/* ========== PERSONAL SECTION ========== */}
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

        {/* ✅ NEW: My Registrations */}
        <Route
          path="registrations"
          element={
            <RoleGate permission="dashboard.profile">
              <MyRegistrations />
            </RoleGate>
          }
        />

        {/* ✅ My Certificates */}
        <Route
          path="certificates"
          element={
            <RoleGate permission="dashboard.profile">
              <MyCertificates />
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

        {/* ========== MEMBER SECTION ========== */}
        <Route
          path="tasks"
          element={
            <RoleGate permission="dashboard.tasks">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-dark">Member Tasks</h2>
                <p className="text-gray mt-2">Coming soon...</p>
              </div>
            </RoleGate>
          }
        />

        {/* ========== MANAGEMENT SECTION ========== */}

        {/* Events Management */}
        <Route
          path="manage/events"
          element={
            <RoleGate permission="manage.events">
              <EventsManagement />
            </RoleGate>
          }
        />

        {/* Event Participants */}
        <Route
          path="manage/events/:id/participants"
          element={
            <RoleGate permission="manage.events">
              <EventParticipants />
            </RoleGate>
          }
        />

        {/* Gallery Management */}
        <Route
          path="manage/gallery"
          element={
            <RoleGate permission="manage.gallery">
              <GalleryManagement />
            </RoleGate>
          }
        />

        {/* Members Management */}
        <Route
          path="manage/members"
          element={
            <RoleGate permission="manage.members">
              <Members />
            </RoleGate>
          }
        />

        {/* ========== ✅ EMAIL SYSTEM ========== */}

        {/* Compose Email */}
        <Route
          path="manage/compose-email"
          element={
            <RoleGate permission="manage.members">
              <ComposeEmail />
            </RoleGate>
          }
        />

        {/* Email History/Logs */}
        <Route
          path="manage/email-logs"
          element={
            <RoleGate permission="manage.members">
              <EmailLogs />
            </RoleGate>
          }
        />

        {/* ========== ADMINISTRATION SECTION ========== */}

        {/* User Management */}
        <Route
          path="manage/users"
          element={
            <RoleGate permission="manage.users">
              <UserManagement />
            </RoleGate>
          }
        />

        {/* Catch-all for dashboard routes */}
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Route>

      {/* ================= 404 NOT FOUND ================= */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <p className="text-xl text-gray mb-6">Page not found</p>
              <a href="/" className="btn-primary inline-block px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark font-semibold">
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
