/**
 * Auth Routes
 * Mount points: /api/auth
 */
const router = require("express").Router();
const authController = require("../controllers/auth.controller.js");
const validate = require("../middleware/validate.middleware.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const { z } = require("zod");

// Validation Schemas
const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

// Public routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// Protected Route
router.get("/me", authMiddleware, authController.me);

module.exports = router;
