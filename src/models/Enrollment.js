const { Schema, model } = require("mongoose");

const enrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    batchId: { type: Schema.Types.ObjectId },

    progress: {
      completedLessons: [{ type: Schema.Types.ObjectId }],
      percent: { type: Number, default: 0, min: 0, max: 100 },
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollment
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = model("Enrollment", enrollmentSchema);