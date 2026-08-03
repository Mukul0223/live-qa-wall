/*
 *Created a event schema to hold details about the event
 **/
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      unique: true,
      trim: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    participantCount: {
      type: Number,
      default: 0,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

eventSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.__v;
    return returnedObject;
  },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
