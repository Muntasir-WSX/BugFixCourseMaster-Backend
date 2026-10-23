const courseService = require("../services/course.service");
const connectDB = require("../config/db");

const getCourses = async (req, res) => {
  try {
    await connectDB();
    const data = await courseService.getCourses(req.query);
    res.json(data);
  } catch (err) {
    console.error("Get courses error:", err.message);
    res.status(500).json({ message: err.message || "Failed to fetch courses" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(404).json({ message: err.message || "Course not found" });
  }
};

module.exports = { getCourses, getCourseById };