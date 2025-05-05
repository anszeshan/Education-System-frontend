const express = require("express");
const { createBadgeAward, getBadgeAwards } = require("../controllers/badgeAwardController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("guide"), createBadgeAward);
router.get("/", authMiddleware, roleMiddleware("guide"), getBadgeAwards);

module.exports = router;