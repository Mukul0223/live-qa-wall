/**
 * DashboardPage Component
 * Protected host home view greeting the user, providing a route to event creation,
 * and holding a placeholder section for the real event list (wired in Milestone 10).
 */
import { Link } from "react-router-dom";
import { Plus, Calendar, FolderOpen, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth"; // Adjust path to match your hook location

export const DashboardPage = () => {
  const { user } = useAuth();

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

      {/* Main Content Area: Event List Shell */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
        </div>

        {/* Milestone 10 Placeholder Section */}
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
      </div>
    </div>
  );
};

export default DashboardPage;
