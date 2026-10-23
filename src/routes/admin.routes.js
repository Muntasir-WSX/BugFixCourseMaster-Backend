// route definitions for admin-related endpoints

const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Apply auth and admin check to all admin routes globally
router.use(authMiddleware, adminMiddleware);

// course CRUD
router.post("/courses", adminController.createCourse);
router.put("/courses/:id", adminController.updateCourse);
router.patch("/courses/:id", adminController.updateCourse);
router.delete("/courses/:id", adminController.deleteCourse);

// lists
router.get("/enrollments", adminController.getEnrollments);
router.get("/assignments", adminController.getAssignments);

// review assignment submission
router.patch("/assignments/:id/review", adminController.reviewAssignment);

// analytics
router.get("/analytics", adminController.getAnalytics);

module.exports = router;