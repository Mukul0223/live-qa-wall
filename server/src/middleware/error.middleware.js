/**
 * Single Responsibility: Centralized error handling middleware that formats
 * thrown errors into consistent JSON responses.
 */

const ApiError = require("../utils/ApiError.js");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let details = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const responsePayload = {
    success: false,
    message,
    ...(details && { details }),
  };

  if (process.env.NODE_ENV === "development") {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

module.exports = errorHandler;
