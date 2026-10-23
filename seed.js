const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Enrollment = require("./src/models/Enrollment");
const QuizSubmission = require("./src/models/QuizSubmission");
const AssignmentSubmission = require("./src/models/AssignmentSubmission");

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await QuizSubmission.deleteMany({});
    await AssignmentSubmission.deleteMany({});

    console.log("Seeding Users...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    const adminUser = await User.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL || "admin@coursemaster.com",
      passwordHash: hashedPassword,
      role: "admin",
    });

    const student1 = await User.create({
      name: "Rahim Chowdhury",
      email: "student@coursemaster.com",
      passwordHash: studentPassword,
      role: "student",
    });

    const student2 = await User.create({
      name: "Tamim Hasan",
      email: "tamim@gmail.com",
      passwordHash: studentPassword,
      role: "student",
    });

    const student3 = await User.create({
      name: "Sumaiya Akter",
      email: "sumaiya@gmail.com",
      passwordHash: studentPassword,
      role: "student",
    });

    console.log("Seeding Courses...");
    const course1 = await Course.create({
      title: "Complete Web Development Masterclass with Next.js & React 19",
      description: "Master modern web development from HTML/CSS to advanced React 19, Next.js App Router, Express, and MongoDB.",
      instructorName: "Jhankar Mahbub",
      price: 5000,
      category: "Web Development",
      tags: ["React", "Next.js", "JavaScript", "Fullstack", "Node.js"],
      batches: [
        { name: "Batch 1 (Spring 2026)", startDate: new Date("2026-01-10") },
        { name: "Batch 2 (Summer 2026)", startDate: new Date("2026-06-01") },
      ],
      syllabus: [
        {
          title: "Module 1: Modern HTML, CSS & Responsive Design",
          lessons: [
            {
              title: "Lesson 1: Introduction to HTML5 & Semantic Elements",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              liveClassLink: "https://meet.google.com/abc-defg-hij",
              liveClassDate: new Date("2026-04-15T18:00:00.000Z"),
              quiz: [
                {
                  question: "Which HTML5 tag is used to specify a header for a document or section?",
                  options: ["<section>", "<header>", "<head>", "<top>"],
                  correctIndex: 1,
                },
                {
                  question: "What is the correct HTML element for inserting a line break?",
                  options: ["<break>", "<lb>", "<br>", "<line>"],
                  correctIndex: 2,
                },
              ],
            },
            {
              title: "Lesson 2: Flexbox & Grid Layouts Deep Dive",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignmentPrompt: "Build a fully responsive pricing card layout using CSS Flexbox and Grid.",
            },
          ],
        },
      ],
    });

    console.log("Seeding Enrollments...");
    const lesson1Id = course1.syllabus[0].lessons[0]._id;

    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      batchId: course1.batches[0]._id,
      progress: {
        completedLessons: [lesson1Id],
        percent: 25,
      },
    });

    console.log("Seeding Quiz & Assignment Submissions...");
    await QuizSubmission.create({
      student: student1._id,
      course: course1._id,
      lessonId: lesson1Id,
      answers: [1, 2],
      score: 2,
      total: 2,
      percent: 100,
    });

    const lesson2Id = course1.syllabus[0].lessons[1]._id;
    await AssignmentSubmission.create({
      student: student1._id,
      course: course1._id,
      lessonId: lesson2Id,
      answerType: "link",
      answer: "https://github.com/rahim/pricing-card-assignment",
      status: "reviewed",
      reviewer: adminUser._id,
      reviewNotes: "Great job! Responsive layout looks clean.",
      grade: 95,
    });

    console.log("Database Seeded Successfully! ✅");
  } catch (error) {
    console.error("Seeding Error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDatabase();