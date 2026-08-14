/**
 * HostRoomPage Component
 * Host's live session management view. Fetches event by ID, renders code display,
 * provides event status controls (End Event with confirmation), and holds space
 * for live questions coming in Milestone 13.
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Radio,
  Power,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import EventCodeDisplay from "../components/event/EventCodeDisplay";
import { getEventById, endEvent } from "../api/event.api";

export default function HostRoomPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch event details on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(eventId);
        // Safely parse safely across possible wrapper formats
        const eventData =
          response?.data?.event ||
          response?.data ||
          response?.event ||
          response;
        setEvent(eventData);
      } catch (error) {
        console.error("Failed to load host room:", error);
        // On 403 (unauthorized/not owner) or 404, redirect to Dashboard
        navigate("/dashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId, navigate]);

  // Handle End Event execution
  const handleEndEvent = async () => {
    setShowConfirmModal(false);
    setEnding(true);
    try {
      const response = await endEvent(eventId);
      const updatedEvent =
        response?.data?.event || response?.data || response?.event || response;
      setEvent((prev) => ({
        ...prev,
        status: updatedEvent?.status || "ended",
      }));
    } catch (error) {
      console.error("Failed to end event:", error);
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Loading Host Room...</p>
      </div>
    );
  }

  if (!event) return null;

  const isActive = event.status === "active";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {isActive && <Radio className="w-3 h-3 animate-pulse" />}
          {event.status}
        </span>
      </div>

      {/* Header Info & End Event Action */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          {event.description && (
            <p className="text-gray-600 text-sm mt-1">{event.description}</p>
          )}
        </div>

        {isActive && (
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={ending}
            className="inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {ending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            End Event
          </button>
        )}
      </div>

      {/* 6-Digit Join Code Display */}
      <EventCodeDisplay code={event.code} />

      {/* Live Question List Placeholder (Coming in Milestone 13) */}
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Live Question Wall Shell
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Audience questions, upvotes, pinning, and real-time Socket.IO
            synchronization will appear here in Milestone 13.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Coming up in
            Milestone 13
          </span>
        </div>
      </div>

      {/* End Event Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">
              End this session?
            </h3>
            <p className="text-sm text-gray-600">
              Ending this event will prevent new questions from being submitted.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEndEvent}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                End Event Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
