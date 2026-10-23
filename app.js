const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// importing routes
const authRoutes = require("./src/routes/auth.routes");
const courseRoutes = require("./src/routes/course.routes");
const adminRoutes = require("./src/routes/admin.routes");
const enrollmentRoutes = require("./src/routes/enrollment.routes");
const assignmentRoutes = require("./src/routes/assignment.routes");
const quizRoutes = require("./src/routes/quiz.routes");
const userRoutes = require("./src/routes/user.routes");

const errorHandler = require("./src/middlewares/errorMiddleware");
const connectDB = require("./src/config/db");

const app = express();

// Standard CORS setup allowing all standard methods (GET, POST, PUT, DELETE, etc.)
app.use(cors());
app.use(express.json());

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error("Database connection middleware error:", err.message);
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

// health check
app.get("/", (req, res) => {
  res.send("Course Master Backend Running ✅");
});

// mounting routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/users", userRoutes);

// 404 handler (unknown routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// global error handling middleware
app.use(errorHandler);

module.exports = app;