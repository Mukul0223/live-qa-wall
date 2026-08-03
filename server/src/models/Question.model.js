/*
 * Created question schema to hold details about the questions.
 * */
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    text: {
      type: String,
      maxLength: 500,
      required: [true, "Question/text required."],
    },
    authorNickname: {
      type: String,
      default: "Anonymous",
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    /* *Since question are asked by participants that are anonymous */
    upvoterIds: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["active", "answered", "pinned", "archived"],
      default: "active",
    },
  },
  { timestamps: true },
);

questionSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.__v;
    return returnedObject;
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
