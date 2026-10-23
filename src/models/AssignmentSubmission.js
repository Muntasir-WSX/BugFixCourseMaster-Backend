const { Schema, model } = require("mongoose");

const assignmentSubmissionSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: Schema.Types.ObjectId, required: true },

    answerType: { type: String, enum: ["text", "link"], required: true },
    answer: { type: String, required: true },

    status: { type: String, enum: ["submitted", "reviewed"], default: "submitted" },
    reviewer: { type: Schema.Types.ObjectId, ref: "User" },
    reviewNotes: { type: String },
    grade: { type: Number, min: 0 },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate assignment submissions for the same lesson
assignmentSubmissionSchema.index({ student: 1, course: 1, lessonId: 1 }, { unique: true });

module.exports = model("AssignmentSubmission", assignmentSubmissionSchema);