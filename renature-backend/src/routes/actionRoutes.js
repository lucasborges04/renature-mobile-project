const express = require("express");
const router = express.Router();
const actionController = require("../controllers/actionController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/scan", protect, actionController.registerScan);

router.post("/barcode", protect, actionController.registerBarcodeScan);

router.get("/history", protect, actionController.getHistory);

module.exports = router;
