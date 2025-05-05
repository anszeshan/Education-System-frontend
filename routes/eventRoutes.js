const express = require("express");
const { getEvents, createEvent } = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getEvents);
router.post("/", authMiddleware, roleMiddleware("admin"), createEvent);

module.exports = router;