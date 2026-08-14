/**
 * CreateEventPage Component
 * Host page for creating a new Q&A session. Connects EventForm to the
 * event API and redirects to the Host Room on success.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EventForm from "../components/event/EventForm";
import { createEvent } from "../api/event.api";

export default function CreateEventPage() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      const response = await createEvent(formData);

      // Extract new event ID (handling nested API structures safely)
      const newEvent =
        response?.data?.event || response?.data || response?.event || response;
      const eventId = newEvent?._id;

      if (eventId) {
        // Redirect directly to the Host Room for this event
        navigate(`/host/${eventId}`);
      } else {
        console.error("Event created but no ID returned:", response);
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-sm text-gray-600 mt-1">
          Set up a live Q&A session and invite your audience with a 6-digit
          code.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
        <EventForm
          onSubmit={handleCreate}
          buttonText="Create Event & Open Room"
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}
