const registerEventRoomHandlers = (io, socket) => {
  // Reads the live count directly from Socket.IO's own room registry
  // instead of a manually accumulated DB counter. This is authoritative
  // by construction — it can never drift, since nothing is incremented
  // or decremented; it's just counted fresh from actual connected sockets
  // every time it's broadcast.
  const getRoomSize = (eventId) =>
    io.sockets.adapter.rooms.get(eventId)?.size || 0;

  // HANDLER 1: Join Room (Now with Automatic Cleanup & Same-Room Guard)
  socket.on("event:join", ({ eventId }) => {
    try {
      // Guard: If already in this specific room, do nothing to prevent duplicate counts
      if (socket.currentEventId === eventId) {
        return;
      }

      // 1. Clean up previous room if switching directly without an explicit leave
      if (socket.currentEventId && socket.currentEventId !== eventId) {
        const prevEventId = socket.currentEventId;
        socket.leave(prevEventId);
        socket.currentEventId = null;

        io.to(prevEventId).emit("participant:left", {
          eventId: prevEventId,
          participantCount: getRoomSize(prevEventId),
          socketId: socket.id,
        });
      }

      // 2. Join the new room channel
      socket.join(eventId);
      socket.currentEventId = eventId;

      // 3. Notify the new room that the user has joined, with the true live count
      io.to(eventId).emit("participant:joined", {
        eventId,
        participantCount: getRoomSize(eventId),
        socketId: socket.id,
      });
    } catch (error) {
      console.error(`[Socket] Error joining event room ${eventId}:`, error);
      socket.emit("error", { message: "Failed to join event room" });
    }
  });

  // HANDLER 2: Leave Room
  socket.on("event:leave", ({ eventId }) => {
    try {
      socket.leave(eventId);
      socket.currentEventId = null;

      io.to(eventId).emit("participant:left", {
        eventId,
        participantCount: getRoomSize(eventId),
        socketId: socket.id,
      });
    } catch (error) {
      console.error(`[Socket] Error leaving event room ${eventId}:`, error);
      socket.emit("error", { message: "Failed to leave event room" });
    }
  });

  // HANDLER 3: Unexpected Disconnect
  // By the time "disconnect" fires, Socket.IO has already removed this
  // socket from all its rooms, so the room size read here already
  // reflects this socket's departure — no manual bookkeeping needed.
  socket.on("disconnect", () => {
    try {
      const eventId = socket.currentEventId;

      if (eventId) {
        io.to(eventId).emit("participant:left", {
          eventId,
          participantCount: getRoomSize(eventId),
          socketId: socket.id,
        });
      }
    } catch (error) {
      console.error(
        `[Socket] Error handling disconnect for ${socket.id}:`,
        error,
      );
    }
  });
};

module.exports = registerEventRoomHandlers;
