const express = require("express");
const { getActivityReports, getAttendanceReports, exportReport, getAttendanceGraphData, getStudentReports, getAttendancePredictions } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/activities", authMiddleware, getActivityReports);
router.get("/attendance", authMiddleware, getAttendanceReports);
router.get("/students", authMiddleware, getStudentReports);
router.get("/export", authMiddleware, exportReport);
router.get("/attendance-graph", authMiddleware, getAttendanceGraphData);
router.get("/attendance-predictions", authMiddleware, getAttendancePredictions);
module.exports = router;