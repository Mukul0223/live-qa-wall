/**
 * Question Controller
 * Handles incoming HTTP requests for question routes
 */

const asyncHandler = require("../utils/asyncHandler.js");
const questionService = require("../services/question.service.js");
const { getIo } = require("../sockets/index.js");

/**
 * POST /api/events/:eventId/questions
 */
const createQuestion = asyncHandler(async (req, res) => {
  const { text, authorNickname } = req.body;
  const { eventId } = req.params;

  const question = await questionService.createQuestion(
    eventId,
    text,
    authorNickname,
  );

  const io = getIo();
  io.to(eventId).emit("question:created", question);
  res.status(201).json({
    success: true,
    message: "Question created",
    data: { question },
  });
});

/**
 * GET /api/events/:eventId/questions
 */
const getQuestions = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const questions = await questionService.eventQuestionList(eventId);

  res.status(200).json({
    success: true,
    data: { questions },
  });
});

/**
 * POST /api/questions/:id/upvote
 */
const upvoteQuestion = asyncHandler(async (req, res) => {
  const questionId = req.params.id;
  const { participantId } = req.body;

  const question = await questionService.upvoteQuestion(
    questionId,
    participantId,
  );

  getIo().to(question.eventId.toString()).emit("question:upvoted", question);
  res.status(200).json({
    success: true,
    data: { question },
  });
});

/**
 * PATCH /api/questions/:id/pin
 */
const togglePinQuestion = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const questionId = req.params.id;

  const question = await questionService.togglePin(hostId, questionId);

  getIo().to(question.eventId.toString()).emit("question:pinned", question);
  res.status(200).json({
    success: true,
    data: { question },
  });
});

/**
 * PATCH /api/questions/:id/answer
 */
const markQuestionAnswerd = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const questionId = req.params.id;

  const question = await questionService.markedAnswered(hostId, questionId);

  getIo().to(question.eventId.toString()).emit("question:answered", question);
  res.status(200).json({
    success: true,
    data: { question },
  });
});

/**
 * PATCH /api/questions/:id/archive
 */
const archiveQuestion = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const questionId = req.params.id;

  const question = await questionService.archiveQuestion(hostId, questionId);

  getIo().to(question.eventId.toString()).emit("question:archived", question);
  res.status(200).json({
    success: true,
    data: { question },
  });
});

/**
 * DELETE /api/questions/:id
 */
const deleteQuestion = asyncHandler(async (req, res) => {
  const hostId = req.user._id;
  const questionId = req.params.id;

  const { message, eventId } = await questionService.deleteQuestion(
    hostId,
    questionId,
  );

  getIo().to(eventId).emit("question:deleted", { questionId });

  res.status(200).json({
    success: true,
    message,
  });
});

module.exports = {
  createQuestion,
  getQuestions,
  upvoteQuestion,
  togglePinQuestion,
  markQuestionAnswerd,
  archiveQuestion,
  deleteQuestion,
};
