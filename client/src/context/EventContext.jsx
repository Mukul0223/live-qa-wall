import { useState, useCallback, useMemo } from "react";
import { EventContext } from "./eventContextObject";
import { getEventById } from "../api/event.api";
import { listForEvent } from "../api/question.api";
import { useEventSocket } from "../hooks/useEventSocket";

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
  const loadEvent = useCallback(async (targetEventId) => {
    setLoading(true);
    setError(null);
    try {
      const [eventData, questionsData] = await Promise.all([
        getEventById(targetEventId),
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
  const socketHandlers = useMemo(
    () => ({
      "question:created": (newQuestion) => {
        setQuestions((prev) => {
          if (prev.some((q) => q._id === newQuestion._id)) return prev;
          return [...prev, newQuestion];
        });
      },

      "question:upvoted": (updatedQuestion) => {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === updatedQuestion._id ? updatedQuestion : q,
          ),
        );
      },

      "question:pinned": (updatedQuestion) => {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === updatedQuestion._id ? updatedQuestion : q,
          ),
        );
      },

      "question:answered": (updatedQuestion) => {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === updatedQuestion._id ? updatedQuestion : q,
          ),
        );
      },

      "question:archived": (updatedQuestion) => {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === updatedQuestion._id ? updatedQuestion : q,
          ),
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
        setParticipantCount((prev) =>
          data?.count !== undefined ? data.count : prev + 1,
        );
      },

      "participant:left": (data) => {
        setParticipantCount((prev) =>
          data?.count !== undefined ? data.count : Math.max(0, prev - 1),
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
