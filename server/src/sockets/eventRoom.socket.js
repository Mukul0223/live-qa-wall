const Event = require("../models/Event.model.js");

const registerEventRoomHandlers = (io, socket) => {
  // HANDLER 1: Join Room (Now with Automatic Cleanup & Same-Room Guard)
  socket.on("event:join", async ({ eventId }) => {
    try {
      // Guard: If already in this specific room, do nothing to prevent duplicate counts
      if (socket.currentEventId === eventId) {
        return;
      }

      // 1. Clean up previous room if switching directly without an explicit leave
      if (socket.currentEventId && socket.currentEventId !== eventId) {
        const prevEventId = socket.currentEventId;
        socket.leave(prevEventId);

        const prevUpdated = await Event.findOneAndUpdate(
          { _id: prevEventId, participantCount: { $gt: 0 } },
          { $inc: { participantCount: -1 } },
          { new: true },
        );

        io.to(prevEventId).emit("participant:left", {
          eventId: prevEventId,
          participantCount: prevUpdated ? prevUpdated.participantCount : 0,
          socketId: socket.id,
        });
      }

      // 2. Join the new room channel
      socket.join(eventId);
      socket.currentEventId = eventId;

      // 3. Update DB: Atomically increment participant count for the new room
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $inc: { participantCount: 1 } },
        { new: true },
      );

      // 4. Notify the new room that the user has joined
      io.to(eventId).emit("participant:joined", {
        eventId,
        participantCount: updatedEvent ? updatedEvent.participantCount : 0,
        socketId: socket.id,
      });
    } catch (error) {
      console.error(`[Socket] Error joining event room ${eventId}:`, error);
      socket.emit("error", { message: "Failed to join event room" });
    }
  });

  // HANDLER 2: Leave Room
  socket.on("event:leave", async ({ eventId }) => {
    try {
      socket.leave(eventId);
      socket.currentEventId = null;

      const updatedEvent = await Event.findOneAndUpdate(
        { _id: eventId, participantCount: { $gt: 0 } },
        { $inc: { participantCount: -1 } },
        { new: true },
      );

      io.to(eventId).emit("participant:left", {
        eventId,
        participantCount: updatedEvent ? updatedEvent.participantCount : 0,
        socketId: socket.id,
      });
    } catch (error) {
      console.error(`[Socket] Error leaving event room ${eventId}:`, error);
      socket.emit("error", { message: "Failed to leave event room" });
    }
  });

  // HANDLER 3: Unexpected Disconnect
  socket.on("disconnect", async () => {
    try {
      const eventId = socket.currentEventId;

      if (eventId) {
        const updatedEvent = await Event.findOneAndUpdate(
          { _id: eventId, participantCount: { $gt: 0 } },
          { $inc: { participantCount: -1 } },
          { new: true },
        );

        io.to(eventId).emit("participant:left", {
          eventId,
          participantCount: updatedEvent ? updatedEvent.participantCount : 0,
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
