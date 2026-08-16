import { useEffect, useRef } from "react";
import { socket, connectSocket } from "../sockets/socketClient";

/**
 * Custom hook to manage joining/leaving a Socket.IO event room
 * and subscribing to the 9 official real-time socket events.
 *
 * @param {string} eventId - The MongoDB ID of the active event.
 * @param {Object} handlers - Map of socket event names to handler functions.
 */
export const useEventSocket = (eventId, handlers = {}) => {
  // Store handlers in a ref so useEffect doesn't re-subscribe on every render
  const handlersRef = useRef(handlers);

  // Keep the ref updated with the latest handlers on each render
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!eventId) return;

    connectSocket();
    socket.emit("event:join", { eventId });

    const eventNames = [
      "question:created",
      "question:upvoted",
      "question:pinned",
      "question:answered",
      "question:archived",
      "question:deleted",
      "event:ended",
      "participant:joined",
      "participant:left",
    ];

    // Map each socket event to call the latest handler from handlersRef
    const activeListeners = {};

    eventNames.forEach((eventName) => {
      const listener = (data) => {
        if (handlersRef.current[eventName]) {
          handlersRef.current[eventName](data);
        }
      };

      activeListeners[eventName] = listener;
      socket.on(eventName, listener);
    });

    return () => {
      socket.emit("event:leave", { eventId });

      eventNames.forEach((eventName) => {
        if (activeListeners[eventName]) {
          socket.off(eventName, activeListeners[eventName]);
        }
      });
    };
  }, [eventId]); // Strictly depends on eventId
};
