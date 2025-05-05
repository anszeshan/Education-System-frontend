const express = require("express");
const { getAttendance, getAttendanceSummary, getAttendanceTrend, markAttendance } = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", authMiddleware, markAttendance);
router.get("/", authMiddleware, getAttendance);
router.get("/summary", authMiddleware, getAttendanceSummary);
router.get("/trend", authMiddleware, getAttendanceTrend);

module.exports = router;