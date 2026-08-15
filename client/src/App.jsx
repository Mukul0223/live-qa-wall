import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CreateEventPage from "./pages/CreateEventPage.jsx";
import EventRoomPage from "./pages/EventRoomPage.jsx";
import JoinPage from "./pages/JoinPage.jsx";
import HostRoomPage from "./pages/HostRoomPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { ToastContainer } from "./components/feedback/ToastContainer.jsx";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Host Routes (Guarded by ProtectedRoute) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/:eventId"
            element={
              <ProtectedRoute>
                <HostRoomPage />
              </ProtectedRoute>
            }
          />

          {/* Audience Routes */}
          <Route path="/join/:code?" element={<JoinPage />} />
          <Route path="/event/:eventId" element={<EventRoomPage />} />

          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
