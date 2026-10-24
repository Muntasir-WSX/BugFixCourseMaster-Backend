const courseService = require("../services/course.service");

const getCourses = async (req, res) => {
  try {
    const data = await courseService.getCourses(req.query);
    res.status(200).json(data);
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
    res.status(200).json(course);
  } catch (err) {
    res.status(404).json({ message: err.message || "Course not found" });
  }
};

module.exports = { getCourses, getCourseById };