const express = require("express");
const { getAwards, createAward, updateAward, deleteAward, getStudentsForAward } = require("../controllers/awardController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAwards);
router.post("/", authMiddleware, roleMiddleware("admin"), createAward);
router.put("/:awardId", authMiddleware, roleMiddleware("admin"), updateAward);
router.delete("/:awardId", authMiddleware, roleMiddleware("admin"), deleteAward);
router.get("/:awardId/students", authMiddleware, getStudentsForAward);

module.exports = router;