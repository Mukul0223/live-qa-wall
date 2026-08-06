/**
 * Auth Service
 * Responsible for core authentication logic: password hashing, user registration,
 * credential validation, and JWT generation.
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.model.js");
const ApiError = require("../utils/ApiError.js");

/**
 * Signs a JWT with the user's ID as payload.
 * @param {string} userId
 * @returns {string} Signed JWT string
 */
const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Registers a new host.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object, token: string }>}
 */
const register = async (name, email, password) => {
  const mail = email.toLowerCase();

  const emailExists = await User.exists({ email: mail });
  if (emailExists) {
    throw new ApiError(409, "Email is already registered.");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    name,
    email: mail,
    password: passwordHash,
  });

  const token = generateToken(newUser._id);

  // Convert to JSON object to trigger Mongoose schema transform (strips password)
  return { user: newUser.toJSON(), token };
};

/**
 * Authenticates an existing host.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object, token: string }>}
 */
const login = async (email, password) => {
  const mail = email.toLowerCase();
  const user = await User.findOne({ email: mail });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken(user._id);

  return { user: user.toJSON(), token };
};

module.exports = { register, login };
