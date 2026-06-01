const express = require("express");
const router = express.Router();
const actionController = require("../controllers/actionController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/scan", protect, actionController.registerScan);

module.exports = router;
