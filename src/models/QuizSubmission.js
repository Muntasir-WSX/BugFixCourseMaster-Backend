const { Schema, model } = require("mongoose");

const quizSubmissionSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: Schema.Types.ObjectId, required: true },

    answers: [{ type: Number }],
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    percent: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Index for faster queries
quizSubmissionSchema.index({ student: 1, course: 1 });
quizSubmissionSchema.index({ student: 1, course: 1, lessonId: 1 });

module.exports = model("QuizSubmission", quizSubmissionSchema);