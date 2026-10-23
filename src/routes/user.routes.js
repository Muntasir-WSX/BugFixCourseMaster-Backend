const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Admin only routes
router.use(authMiddleware, adminMiddleware);

router.get("/", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);
router.patch("/:id/role", userController.updateUserRole);
router.patch("/:id/ban", userController.toggleBanUser);

module.exports = router;