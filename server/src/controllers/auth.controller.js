/**
 * Auth Controller
 * Handles incoming HTTP requests for host authentication routes.
 */
const asyncHandler = require("../utils/asyncHandler.js");
const authService = require("../services/auth.service.js");
const ApiError = require("../utils/ApiError.js");
const User = require("../models/User.model.js");

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register(name, email, password);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user, token },
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: { user, token },
  });
});

/**
 * GET /api/auth/me
 * Protected route: authMiddleware runs before this and attaches req.user
 */
const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User profile not found");
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

module.exports = { register, login, me };
