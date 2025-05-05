const express = require("express");
const { getClasses, createClass, updateClass, deleteClass } = require("../controllers/classController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getClasses);
router.post("/", authMiddleware, roleMiddleware("admin"), createClass);
router.put("/:classId", authMiddleware, roleMiddleware("admin"), updateClass);
router.delete("/:classId", authMiddleware, roleMiddleware("admin"), deleteClass);

module.exports = router;