/**
 * HostRoomPage Component
 * The host's live moderation view for a single event: event details, join
 * code, live dashboard stats, and pin/answer/archive/delete controls over
 * the same real-time question data the audience Event Room uses.
 *
 * Initial load is a two-step process:
 *   1. An ownership-gated fetch (getEventById — protected, host-only,
 *      403/404 on non-owner or missing event) confirms this host is
 *      actually allowed to be here at all, redirecting to the Dashboard
 *      if not. This is a one-time REST-level authorization check.
 *   2. Once authorized, EventContext's loadEvent (the same public,
 *      ownership-agnostic loader EventRoomPage uses) takes over as the
 *      actual live data source, wiring up Socket.IO so this page updates
 *      in real time exactly like the audience Event Room does.
 *
 * After that initial gate, every host action (pin/answer/archive/delete/
 * end event) only ever calls its REST endpoint — it never updates local
 * state directly. The resulting Socket.IO broadcast, already handled by
 * EventContext since Milestone 12, is what actually updates the shared
 * question/event state this page re-renders from. This keeps one single
 * source of truth instead of risking the UI briefly showing an optimistic
 * update that then gets overwritten by a slightly different broadcast.
 */
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Radio, Power, Loader2 } from "lucide-react";

import EventCodeDisplay from "../components/event/EventCodeDisplay";
import { getEventById, endEvent } from "../api/event.api";
import { pin, answer, archive, deleteQuestion } from "../api/question.api";

import { EventProvider } from "../context/EventContext";
import { useEvent } from "../hooks/useEvent";

import QuestionList from "../components/question/QuestionList";
import PinnedQuestionsPanel from "../components/question/PinnedQuestionsPanel";

const HostRoomContent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [checkingOwnership, setCheckingOwnership] = useState(true);
  const [ending, setEnding] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { event, questions, participantCount, loading, error, loadEvent } =
    useEvent();

  // Step 1: ownership gate. Only once this succeeds do we hand off to
  // EventContext's live loader below.
  useEffect(() => {
    const verifyOwnership = async () => {
      try {
        await getEventById(eventId);
        setAuthorized(true);
      } catch (err) {
        console.error("Host Room access denied:", err);
        // 403 (not the owner) or 404 (event doesn't exist) both result in
        // the same outcome: this host has no business being on this page.
        navigate("/dashboard", { replace: true });
      } finally {
        setCheckingOwnership(false);
      }
    };

    if (eventId) verifyOwnership();
  }, [eventId, navigate]);

  // Step 2: once authorized, load the live event via the same
  // ownership-agnostic public loader EventRoomPage uses — this is what
  // actually wires up the Socket.IO subscription (see EventContext).
  useEffect(() => {
    if (authorized && eventId) {
      loadEvent(eventId);
    }
  }, [authorized, eventId, loadEvent]);

  // ---------------------------------------------------------------------
  // Host Actions — each is a bare REST call; the broadcast loop (already
  // proven in Milestone 12) is trusted to update `event`/`questions`.
  // ---------------------------------------------------------------------
  const handleEndEvent = useCallback(async () => {
    setShowConfirmModal(false);
    setEnding(true);
    try {
      await endEvent(eventId);
      // No manual setEvent here — event:ended broadcasts back to this
      // same host's socket too, so EventContext updates `event.status`
      // for us the same way it does for every audience member.
    } catch (err) {
      console.error("Failed to end event:", err);
    } finally {
      setEnding(false);
    }
  }, [eventId]);

  const handleTogglePin = useCallback(async (questionId) => {
    try {
      await pin(questionId);
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  }, []);

  const handleToggleAnswer = useCallback(async (questionId) => {
    try {
      await answer(questionId);
    } catch (err) {
      console.error("Failed to toggle answered status:", err);
    }
  }, []);

  const handleArchive = useCallback(async (questionId) => {
    try {
      await archive(questionId);
    } catch (err) {
      console.error("Failed to archive question:", err);
    }
  }, []);

  const handleDelete = useCallback(async (questionId) => {
    // QuestionCard itself confirms before calling this — no second
    // confirmation needed here.
    try {
      await deleteQuestion(questionId);
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  }, []);

  // ---------------------------------------------------------------------
  // Render States
  // ---------------------------------------------------------------------
  if (checkingOwnership || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Loading Host Room...</p>
      </div>
    );
  }

  // Ownership already redirected away on failure; this covers the case
  // where the live (public) loader itself fails after that gate passed
  // (e.g. the event was deleted in between).
  if (error || !event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Event Not Found
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {error || "This event could not be loaded."}
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isActive = event.status === "active";

  // Live dashboard stats (Step 13.4) — derived fresh on every render from
  // EventContext's already-live data, never stored in their own state.
  // "Active" here means not yet answered and not archived — a pinned
  // question is still active work for the host, just prioritized.
  const visibleQuestions = questions.filter((q) => !q.isArchived);
  const activeCount = visibleQuestions.filter((q) => !q.isAnswered).length;
  const answeredCount = visibleQuestions.filter((q) => q.isAnswered).length;

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

      {/* Live Dashboard Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
            Active
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {answeredCount}
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
            Answered
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {participantCount}
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
            Participants
          </div>
        </div>
      </div>

      {/* Live, Moderation-Capable Question Views */}
      <PinnedQuestionsPanel
        isHost
        onToggleAnswer={handleToggleAnswer}
        onTogglePin={handleTogglePin}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />

      <QuestionList
        questions={questions}
        isHost
        onToggleAnswer={handleToggleAnswer}
        onTogglePin={handleTogglePin}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />

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
};

export default function HostRoomPage() {
  return (
    <EventProvider>
      <HostRoomContent />
    </EventProvider>
  );
}
