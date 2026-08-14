/**
 * DashboardPage Component
 * Protected host home view greeting the user, providing a route to event creation,
 * and rendering the real event list fetched from the API (Step 10.2).
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Calendar,
  FolderOpen,
  Sparkles,
  Radio,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getEvents } from "../api/event.api";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();

        // Safely extract events whether it's response.data.events, response.events, or an array
        const eventList =
          response?.data?.events ||
          response?.events ||
          (Array.isArray(response) ? response : []);

        setEvents(eventList);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Welcome back, {user?.name || "Host"}!
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-100" />
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your live Q&A events or launch a new session.
          </p>
        </div>

        {/* Primary Action Button */}
        <Link
          to="/events/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Event
        </Link>
      </div>

      {/* Main Content Area: Event List Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
        </div>

        {/* 1. Loading State */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm font-medium">Loading your events...</p>
          </div>
        ) : events.length === 0 ? (
          /* 2. Empty State (Preserved from original component) */
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
            <div className="max-w-sm mx-auto flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                <FolderOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No events found yet
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Your active and upcoming Q&A sessions will appear here once
                created.
              </p>
              <Link
                to="/events/new"
                className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800"
              >
                Create your first event &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* 3. Real Event List Grid */
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => {
              const isActive = event.status === "active";
              return (
                <Link
                  key={event._id}
                  to={`/host/${event._id}`}
                  className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition duration-150 ease-in-out"
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">
                      {event.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                        isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isActive && <Radio className="w-3 h-3 animate-pulse" />}
                      {(event.status || "active").toUpperCase()}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-500 mt-auto">
                    <span>
                      Code:{" "}
                      <strong className="text-gray-900 tracking-wider font-mono text-sm">
                        {event.code}
                      </strong>
                    </span>
                    <span className="inline-flex items-center text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
                      Manage Room <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
