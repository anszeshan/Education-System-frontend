const express = require("express");
const { getStudents, createStudent, updateStudent, deleteStudent, awardBadge } = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getStudents);
router.post("/", authMiddleware, roleMiddleware("admin"), createStudent);
router.put("/:studentId", authMiddleware, roleMiddleware("admin"), updateStudent);
router.delete("/:studentId", authMiddleware, roleMiddleware("admin"), deleteStudent);
router.post("/award-badge", authMiddleware, roleMiddleware("admin"), awardBadge);

module.exports = router;