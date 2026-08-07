/**
 * Question Controller
 * Handles incoming HTTP requests for question routes
 */

const asyncHandler = require("../utils/asyncHandler.js");
const questionService = require("../services/question.service.js");

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

  const { message } = await questionService.deleteQuestion(hostId, questionId);

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
