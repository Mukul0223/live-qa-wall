/**
 * Single Responsibility: Higher-order wrapper function to catch async errors and forward them to Express error middleware.
 */

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
