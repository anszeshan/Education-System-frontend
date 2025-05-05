const express = require("express");
const {
  getMetrics,
  getWeeklyActivities,
  getUpcomingEvents,
  getStudentPerformance,
  getGuideActivity,
  getSystemHealth,
} = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/metrics", authMiddleware, getMetrics);
router.get("/weekly-activities", authMiddleware, getWeeklyActivities);
router.get("/upcoming-events", authMiddleware, getUpcomingEvents);
router.get("/student-performance", authMiddleware, getStudentPerformance);
router.get("/guide-activity", authMiddleware, getGuideActivity);
router.get("/system-health", authMiddleware, getSystemHealth);

module.exports = router;