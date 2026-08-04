/**
 * User Model
 * Schema representing Host accounts.
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: { type: String, required: [true, "Password is required"] },
  },
  { timestamps: true },
);

/*
 * Strips password and internal version key (__v) when converted to JSON
 * to prevent sensitive data exposure in responses.
 */
UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject.password;
    return returnedObject;
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
