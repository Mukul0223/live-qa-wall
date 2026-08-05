const generateEventCode = require("../utils/generateEventCode.js");
const Event = require("../models/Event.model.js");
const ApiError = require("../utils/ApiError.js");
const Question = require("../models/Question.model.js");

// Creates new event
const createEvent = async (hostId, title, description) => {
  const code = await generateEventCode();
  const newEvent = await Event.create({
    hostId,
    title,
    description,
    status: "active",
    code,
  });

  return newEvent;
};

// Gets all the events created by the Host
const getEventsByHost = async (hostId) => {
  const allEvents = await Event.find({ hostId }).sort("-createdAt");
  return allEvents;
};

// Gets a specific event by its id
const getEventById = async (hostId, eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.hostId.toString() !== hostId) {
    throw new ApiError(403, "Forbidden");
  }

  return event;
};

// Updates a specific event
const updateEvent = async (hostId, eventId, title, description) => {
  const event = await getEventById(hostId, eventId);
  event.title = title ?? event.title;
  event.description = description ?? event.description;

  const updatedEvent = await event.save();
  return updatedEvent;
};

// Updates the event status to 'ended'
const endEvent = async (hostId, eventId) => {
  const event = await getEventById(hostId, eventId);
  if (event.status === "ended") {
    throw new ApiError(409, "Event already ended");
  }

  event.status = "ended";
  event.endedAt = new Date();

  const updatedEvent = await event.save();
  return updatedEvent;
};

// Deletes the specific event and all its questions
const deleteEvent = async (hostId, eventId) => {
  const event = await getEventById(hostId, eventId);

  /**If not working use MongoDB Transactions to delete*/
  await Question.deleteMany({ eventId });
  await event.deleteOne();

  return { message: "Event and its questions deleted" };
};

const getEventByCode = async (code) => {
  const event = await Event.findOne({ code }).select(
    "title description code status",
  );

  if (!event) {
    throw new ApiError(404, "Not Found");
  }
  if (event.status === "ended") {
    throw new ApiError(410, "Code Expired");
  }

  return event;
};

module.exports = {
  createEvent,
  getEventsByHost,
  getEventById,
  updateEvent,
  endEvent,
  deleteEvent,
  getEventByCode,
};
