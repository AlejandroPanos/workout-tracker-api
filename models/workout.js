/* Create imports */
const mongoose = require("mongoose");
const { Schema } = mongoose;

/* Create Schema */
const workoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  exercises: [
    {
      type: String,
      required: true,
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

/* Create methods */

/* Create model */
module.exports = mongoose.model("Workout", workoutSchema);
