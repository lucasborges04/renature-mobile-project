const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/profile", protect, userController.getProfile);
router.get("/ranking", protect, userController.getRanking);
router.put("/profile", protect, userController.updateProfile);
router.post(
  "/achievements/unlock",
  authMiddleware,
  userController.unlockAchievement,
);

module.exports = router;
