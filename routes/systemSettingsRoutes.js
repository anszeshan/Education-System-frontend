const express = require("express");
const { getSystemSettings, updateSystemSettings } = require("../controllers/systemSettingsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), getSystemSettings);
router.put("/", authMiddleware, roleMiddleware("admin"), updateSystemSettings);

module.exports = router;