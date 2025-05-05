const express = require("express");
const { getActivities, createActivity, updateActivity, deleteActivity } = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getActivities);
router.post("/", authMiddleware, roleMiddleware("admin"), createActivity);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateActivity);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteActivity);

module.exports = router;