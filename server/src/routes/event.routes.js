/**
 * Events Router
 * Mount point in app.js: app.use("/api/events", router)
 */
const router = require("express").Router();
const eventController = require("../controllers/event.controller.js");
const validate = require("../middleware/validate.middleware.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const questionRoutes = require("../routes/question.routes.js");

const { z } = require("zod");

// Validation Schemas
const createEventSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty"),
  description: z.string().nullish(),
});

const updateEventSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(), // Allowed to be omitted, but if sent, must be min(1)
  description: z.string().nullish(), // Allowed to be omitted or set to null
});

// 1. Public Routes (Defined FIRST before generic /:id routes)
router.get("/join/:code", eventController.getEventByCode);

// 2. Protected Routes (Require Authentication)
router.post(
  "/",
  authMiddleware,
  validate(createEventSchema),
  eventController.createEvent,
);

router.get("/", authMiddleware, eventController.getEvents);

router.get("/:id", authMiddleware, eventController.getEventById);

router.put(
  "/:id",
  authMiddleware,
  validate(updateEventSchema),
  eventController.updateEvent,
);

router.delete("/:id", authMiddleware, eventController.deleteEvent);

router.post("/:id/end", authMiddleware, eventController.endEvent);

router.use("/:eventId/questions", questionRoutes);

module.exports = router;
