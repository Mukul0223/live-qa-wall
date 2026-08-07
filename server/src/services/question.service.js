/**
 * Handles all business logic for the Question model.
 */

const Event = require("../models/Event.model.js");
const Question = require("../models/Question.model.js");
const ApiError = require("../utils/ApiError.js");

const createQuestion = async (eventId, questionText, nickname) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  if (event.status === "ended") {
    throw new ApiError(410, "Event has ended");
  }

  const question = await Question.create({
    eventId: eventId,
    text: questionText,
    status: "active",
    authorNickname: nickname || "Anonymous",
  });

  return question;
};

const eventQuestionList = async (eventId) => {
  const eventExists = await Event.exists({ _id: eventId });
  if (!eventExists) {
    throw new ApiError(404, "Event not found");
  }

  const questions = await Question.find({ eventId: eventId }).sort(
    "-upvoteCount -createdAt",
  );
  return questions;
};

const upvoteQuestion = async (questionId, participantId) => {
  const updatedQuestion = await Question.findOneAndUpdate(
    {
      _id: questionId,
      upvoterIds: { $ne: participantId },
    },
    {
      $push: { upvoterIds: participantId },
      $inc: { upvoteCount: 1 },
    },
    { new: true },
  );

  if (!updatedQuestion) {
    // Determine if question didn't exist or participant already voted
    const questionExists = await Question.exists({ _id: questionId });
    if (!questionExists) {
      throw new ApiError(404, "Question not found");
    }
    throw new ApiError(400, "Already voted");
  }

  return updatedQuestion;
};

const verifyHost = async (hostId, questionId) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const event = await Event.findById(question.eventId);
  if (!event) {
    throw new ApiError(404, "Parent event not found");
  }

  if (event.hostId.toString() !== hostId.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  return question;
};

const togglePin = async (hostId, questionId) => {
  const question = await verifyHost(hostId, questionId);
  question.status = question.status === "active" ? "pinned" : "active";
  await question.save();
  return question;
};

const markedAnswered = async (hostId, questionId) => {
  const question = await verifyHost(hostId, questionId);
  question.status = "answered";
  await question.save();
  return question;
};

const archiveQuestion = async (hostId, questionId) => {
  const question = await verifyHost(hostId, questionId);
  question.status = "archived";
  await question.save();
  return question;
};

const deleteQuestion = async (hostId, questionId) => {
  const question = await verifyHost(hostId, questionId);
  await question.deleteOne();
  return { message: "Question deleted successfully" };
};

module.exports = {
  createQuestion,
  eventQuestionList,
  upvoteQuestion,
  togglePin,
  markedAnswered,
  archiveQuestion,
  deleteQuestion,
};
