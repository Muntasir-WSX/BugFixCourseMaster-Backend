const router = require("express").Router();
const quizController = require("../controllers/quiz.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/submit", quizController.submitQuiz);
router.get("/my", quizController.myQuizSubmissions);
router.get("/stats", quizController.getQuizStats);

module.exports = router;