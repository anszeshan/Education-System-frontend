const express = require("express");
const { createSession, getSessions } = require("../controllers/sessionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("guide"), createSession);
router.get("/", authMiddleware, roleMiddleware("guide"), getSessions);

module.exports = router;