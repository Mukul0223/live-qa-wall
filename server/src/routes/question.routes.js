/**
 * Question Router
 * Mount point in app.js: app.use("/api/questions", router)
 */
const router = require("express").Router({ mergeParams: true }); // Enables reading :eventId from parent event router
const questionController = require("../controllers/question.controller.js");
const validate = require("../middleware/validate.middleware.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const { z } = require("zod");

// 1. Validation Schemas
const createQuestionSchema = z.object({
  body: z.object({
    text: z
      .string({ required_error: "Question text is required" })
      .trim()
      .min(1, "Question text cannot be empty"),
    authorNickname: z.string().nullish(),
  }),
});

const upvoteQuestionSchema = z.object({
  body: z.object({
    participantId: z
      .string({ required_error: "Participant ID is required" })
      .trim()
      .min(1, "Participant ID cannot be empty"),
  }),
});

// 2. Event-Nested Routes (Forwarded from event.routes.js)
// URL Path when called: /api/events/:eventId/questions
router.post(
  "/",
  validate(createQuestionSchema),
  questionController.createQuestion,
);

router.get("/", questionController.getQuestions);

// 3. Standalone Question Routes (Mounted under /api/questions in app.js)
// URL Path when called: /api/questions/:id/upvote
router.post(
  "/:id/upvote",
  validate(upvoteQuestionSchema),
  questionController.upvoteQuestion,
);

// 4. Standalone Host Moderation Routes (Protected)
// URL Paths when called: /api/questions/:id/...
router.patch("/:id/pin", authMiddleware, questionController.togglePinQuestion);

router.patch(
  "/:id/answer",
  authMiddleware,
  questionController.markQuestionAnswerd,
);

router.patch(
  "/:id/archive",
  authMiddleware,
  questionController.archiveQuestion,
);

router.delete("/:id", authMiddleware, questionController.deleteQuestion);

module.exports = router;
