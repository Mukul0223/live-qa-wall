/**
 * Event Controller
 * Handles incoming HTTP requests for event routes
 */

const asyncHandler = require("../utils/asyncHandler.js");
const eventService = require("../services/event.service.js");
const { getIo } = require("../sockets/index.js");

/**
 * POST /api/events
 */
const createEvent = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const hostId = req.user._id;
  const event = await eventService.createEvent(hostId, title, description);

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: { event },
  });
});

/**
 * GET /api/events
 */
const getEvents = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const events = await eventService.getEventsByHost(hostId);

  res.status(200).json({
    success: true,
    data: { events },
  });
});

/**
 * GET /api/events/:id
 */
const getEventById = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const hostId = req.user._id;
  const event = await eventService.getEventById(hostId, eventId);

  res.status(200).json({
    success: true,
    data: { event },
  });
});

/**
 * PUT /api/events/:id
 */
const updateEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const hostId = req.user._id;
  const { title, description } = req.body;

  const event = await eventService.updateEvent(
    hostId,
    eventId,
    title,
    description,
  );

  res.status(200).json({
    success: true,
    data: { event },
  });
});

/**
 * POST /api/events/:id/end
 */
const endEvent = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const eventId = req.params.id;

  const event = await eventService.endEvent(hostId, eventId);

  getIo().to(eventId).emit("event:ended", event);

  res.status(200).json({
    success: true,
    data: { event },
  });
});

/**
 * DELETE /api/events/:id
 */
const deleteEvent = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const eventId = req.params.id;

  const { message } = await eventService.deleteEvent(hostId, eventId);

  res.status(200).json({
    success: true,
    message,
  });
});

/**
 * GET /api/events/join/:code
 */
const getEventByCode = asyncHandler(async (req, res) => {
  const code = req.params.code;

  const event = await eventService.getEventByCode(code);

  res.status(200).json({
    success: true,
    data: { event },
  });
});

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  endEvent,
  deleteEvent,
  getEventByCode,
};
