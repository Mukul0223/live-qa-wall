const Event = require("../models/Event.model.js");
const ApiError = require("./ApiError.js");
const crypto = require("crypto");

const token = () => {
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
};

const generateEventCode = async () => {
  try {
    for (let i = 0; i < 3; i++) {
      let uniqueCode = token();
      const result = await Event.exists({ code: uniqueCode });
      if (result) {
        continue;
      } else {
        return uniqueCode;
      }
    }
    throw new ApiError(500, "Could not generate a unique code");
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(400, "Something went wrong. Please try later.");
  }
};

module.exports = generateEventCode;
