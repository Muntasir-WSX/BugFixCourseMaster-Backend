const { Schema, model } = require("mongoose");

const lessonSchema = new Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    liveClassLink: { type: String },
    liveClassDate: { type: Date },
    assignmentPrompt: { type: String },
    quiz: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { _id: true }
);

const moduleSchema = new Schema(
  {
    title: { type: String, required: true },
    lessons: [lessonSchema],
  },
  { _id: true }
);

const courseSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    instructorName: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, index: true },
    tags: [{ type: String, index: true }],
    syllabus: [moduleSchema],
    batches: [
      {
        name: String,
        startDate: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Course", courseSchema);