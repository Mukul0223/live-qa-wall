import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CreateEventPage from "./pages/CreateEventPage.jsx";
import EventRoomPage from "./pages/EventRoomPage.jsx";
import HostRoomPage from "./pages/HostRoomPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Host Routes */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/events/new" element={<CreateEventPage />} />
      <Route path="/host/:eventId" element={<HostRoomPage />} />

      {/* Audience Routes */}
      <Route path="/join/:code?" element={<EventRoomPage />} />
      <Route path="/event/:eventId" element={<EventRoomPage />} />

      {/* 404 Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
