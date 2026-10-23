const router = require("express").Router();
const assignmentController = require("../controllers/assignment.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/submit", assignmentController.submitAssignment);
router.get("/my", assignmentController.mySubmissions);
router.get("/stats", assignmentController.getAssignmentStats);

module.exports = router;