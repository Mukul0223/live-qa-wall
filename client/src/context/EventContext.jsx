import { useState, useCallback, useMemo } from "react";
import { EventContext } from "./eventContextObject";
import { getEventByIdPublic } from "../api/event.api";
import { listForEvent } from "../api/question.api";
import { useEventSocket } from "../hooks/useEventSocket";
import { normalizeQuestion } from "../utils/normalizeQuestion";

/**
 * EventProvider manages live state for a single active event session.
 * It loads initial event and question data via REST, then subscribes to
 * live Socket.IO events to maintain real-time state synchronization.
 */
export const EventProvider = ({ children }) => {
  const [event, setEvent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const eventId = event?._id || null;

  // 1. Initial REST loader
  // Uses the PUBLIC event-read endpoint — this page has audience members
  // with no JWT at all, so it must never go through the host-only
  // getEventById (which 401s with no token and 403s for non-owners).
  const loadEvent = useCallback(async (targetEventId) => {
    setLoading(true);
    setError(null);
    try {
      const [eventData, questionsData] = await Promise.all([
        getEventByIdPublic(targetEventId),
        listForEvent(targetEventId),
      ]);
      setEvent(eventData);
      setQuestions(questionsData);
      setParticipantCount(eventData.participantCount || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load event data");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Socket Event Handlers
  // NOTE: socket payloads are raw backend documents (they bypass
  // question.api.js entirely), so every question payload here must be
  // normalized the same way the REST layer's questions are.
  const socketHandlers = useMemo(
    () => ({
      "question:created": (newQuestion) => {
        const normalized = normalizeQuestion(newQuestion);
        setQuestions((prev) => {
          if (prev.some((q) => q._id === normalized._id)) return prev;
          return [...prev, normalized];
        });
      },
      "question:upvoted": (updatedQuestion) => {
        const normalized = normalizeQuestion(updatedQuestion);
        setQuestions((prev) =>
          prev.map((q) => (q._id === normalized._id ? normalized : q)),
        );
      },
      "question:pinned": (updatedQuestion) => {
        const normalized = normalizeQuestion(updatedQuestion);
        setQuestions((prev) =>
          prev.map((q) => (q._id === normalized._id ? normalized : q)),
        );
      },
      "question:answered": (updatedQuestion) => {
        const normalized = normalizeQuestion(updatedQuestion);
        setQuestions((prev) =>
          prev.map((q) => (q._id === normalized._id ? normalized : q)),
        );
      },
      "question:archived": (updatedQuestion) => {
        const normalized = normalizeQuestion(updatedQuestion);
        setQuestions((prev) =>
          prev.map((q) => (q._id === normalized._id ? normalized : q)),
        );
      },
      "question:deleted": (data) => {
        const deletedId =
          typeof data === "string" ? data : data.questionId || data._id;
        setQuestions((prev) => prev.filter((q) => q._id !== deletedId));
      },
      "event:ended": (updatedEvent) => {
        setEvent((prev) => ({ ...prev, status: "ended", ...updatedEvent }));
      },
      "participant:joined": (data) => {
        // Backend emits `participantCount`, not `count` — trust the
        // server-authoritative number whenever it's present.
        setParticipantCount((prev) =>
          data?.participantCount !== undefined
            ? data.participantCount
            : prev + 1,
        );
      },
      "participant:left": (data) => {
        setParticipantCount((prev) =>
          data?.participantCount !== undefined
            ? data.participantCount
            : Math.max(0, prev - 1),
        );
      },
    }),
    [],
  );

  // 3. Connect real-time socket subscription
  useEventSocket(eventId, socketHandlers);

  const value = {
    event,
    questions,
    participantCount,
    loading,
    error,
    loadEvent,
    setQuestions,
    setEvent,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
