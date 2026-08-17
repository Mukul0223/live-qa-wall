import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, Check, Power, Radio, ArrowLeft } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { EventProvider } from "../context/EventContext";
import { useEvent } from "../hooks/useEvent";
import { getParticipantId } from "../hooks/useParticipantId";

import { endEvent } from "../api/event.api";
import {
  create,
  upvote,
  answer,
  pin,
  deleteQuestion,
} from "../api/question.api";

import QuestionForm from "../components/question/QuestionForm";
import QuestionList from "../components/question/QuestionList";
import ParticipantCounter from "../components/event/ParticipantCounter";
import PinnedQuestionsPanel from "../components/question/PinnedQuestionsPanel";

const UPVOTES_STORAGE_KEY = "live_qa_upvoted_ids";

const EventRoomContent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Consume centralized state from Context
  const {
    event,
    questions,
    loading,
    error,
    loadEvent,
    setQuestions,
    setEvent,
  } = useEvent();

  const [isCopied, setIsCopied] = useState(false);

  // Track upvoted questions locally
  const [upvotedQuestionIds, setUpvotedQuestionIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`${UPVOTES_STORAGE_KEY}_${eventId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load event data on mount
  useEffect(() => {
    if (eventId) {
      loadEvent(eventId);
    }
  }, [eventId, loadEvent]);

  // Save upvotes to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        `${UPVOTES_STORAGE_KEY}_${eventId}`,
        JSON.stringify(upvotedQuestionIds),
      );
    } catch (err) {
      console.error("Failed to persist upvoted IDs:", err);
    }
  }, [upvotedQuestionIds, eventId]);

  const isHost = Boolean(
    user && event && (user._id === event.hostId || user._id === event.host),
  );

  // ---------------------------------------------------------------------------
  // Participant & Host Actions
  // ---------------------------------------------------------------------------
  const handleSubmitQuestion = async (contentText) => {
    const storedNickname = sessionStorage.getItem("live_qa_nickname");
    const authorName = user?.name || storedNickname || "Anonymous";

    // Calls create(...) from question.api.js
    const created = await create(eventId, {
      content: contentText,
      authorName,
    });

    setQuestions((prev) => {
      if (prev.some((q) => q._id === created._id)) return prev;
      return [created, ...prev];
    });
  };

  const handleUpvote = async (questionId) => {
    // The backend has no "remove vote" endpoint — upvoteQuestion is
    // strictly one-directional, deduplicated by participantId server-side.
    // Once voted, this is a no-op rather than a toggle.
    if (upvotedQuestionIds.includes(questionId)) return;

    setUpvotedQuestionIds((prev) => [...prev, questionId]);

    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q,
      ),
    );

    try {
      const participantId = user?._id || getParticipantId();
      // Calls upvote(...) from question.api.js
      const updated = await upvote(questionId, participantId);
      setQuestions((prev) =>
        prev.map((q) => (q._id === updated._id ? updated : q)),
      );
    } catch (err) {
      console.error("Failed to upvote question:", err);
      // Roll back both optimistic updates — this was always a fresh vote
      // attempt at this point, so undo means undo, not "toggle back".
      setUpvotedQuestionIds((prev) => prev.filter((id) => id !== questionId));
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === questionId
            ? { ...q, upvotes: Math.max(0, q.upvotes - 1) }
            : q,
        ),
      );
    }
  };

  const handleToggleAnswer = async (questionId, isAnswered) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === questionId ? { ...q, isAnswered } : q)),
    );
    // Calls answer(...) from question.api.js
    await answer(questionId);
  };

  const handleTogglePin = async (questionId, isPinned) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === questionId ? { ...q, isPinned } : q)),
    );
    // Calls pin(...) from question.api.js
    await pin(questionId);
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    // Calls deleteQuestion(...) from question.api.js
    await deleteQuestion(questionId);
  };

  const handleEndEvent = async () => {
    if (!window.confirm("Are you sure you want to end this event?")) return;
    try {
      // Calls endEvent(...) from event.api.js
      await endEvent(eventId);
      setEvent((prev) => ({ ...prev, status: "ended" }));
    } catch (err) {
      console.error("Failed to end event:", err);
    }
  };

  const copyEventCode = () => {
    if (!event?.code) return;
    navigator.clipboard.writeText(event.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // ---------------------------------------------------------------------------
  // Render States
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-20 bg-gray-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 px-4 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Event Not Found
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {error ||
            "The event room you are looking for does not exist or has been removed."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Home
        </button>
      </div>
    );
  }

  const isEnded = event.status === "ended";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Event Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isEnded
                      ? "bg-gray-100 text-gray-600"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <Radio
                    className={`w-3.5 h-3.5 ${
                      isEnded
                        ? "text-gray-400"
                        : "text-emerald-500 animate-pulse"
                    }`}
                  />
                  {isEnded ? "Event Ended" : "Live Event"}
                </span>

                <ParticipantCounter />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {event.title}
              </h1>

              {event.description && (
                <p className="mt-1 text-sm text-gray-500 max-w-2xl">
                  {event.description}
                </p>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2">
                <div className="mr-3">
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Event Code
                  </div>
                  <div className="text-lg font-bold text-gray-900 tracking-widest leading-none">
                    {event.code}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyEventCode}
                  className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-indigo-600 border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
                  title="Copy Event Code"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {isHost && !isEnded && (
                <button
                  type="button"
                  onClick={handleEndEvent}
                  className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl text-sm border border-red-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Power className="w-4 h-4" />
                  <span className="hidden sm:inline">End Event</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <QuestionForm
          onSubmitQuestion={handleSubmitQuestion}
          isDisabled={isEnded}
        />

        <PinnedQuestionsPanel mode={isHost ? "host" : "audience"} />

        <QuestionList
          questions={questions}
          isHost={isHost}
          upvotedQuestionIds={upvotedQuestionIds}
          onUpvote={handleUpvote}
          onToggleAnswer={handleToggleAnswer}
          onTogglePin={handleTogglePin}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export const EventRoomPage = () => {
  return (
    <EventProvider>
      <EventRoomContent />
    </EventProvider>
  );
};

export default EventRoomPage;
