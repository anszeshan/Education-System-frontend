const express = require("express");
const { createActivityLog, getActivityLogs } = require("../controllers/activityLogController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("guide"), createActivityLog);
router.get("/", authMiddleware, roleMiddleware("guide"), getActivityLogs);

module.exports = router;