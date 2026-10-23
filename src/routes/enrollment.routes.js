const router = require("express").Router();
const enrollmentController = require("../controllers/enrollment.controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Static routes first to prevent route parameter collision
router.get("/my", authMiddleware, enrollmentController.myEnrollments);

// Dynamic parameter routes
router.post("/:courseId", authMiddleware, enrollmentController.enrollCourse);
router.patch("/:enrollId/complete-lesson", authMiddleware, enrollmentController.completeLesson);

module.exports = router;