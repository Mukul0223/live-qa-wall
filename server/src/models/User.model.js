/*
 * Single Responsibility: TO store hosts credentials and identity
 * */
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
 *deleting paswword to ensure sensitive credentials are never accidentally exposed via API responses
 * */
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
