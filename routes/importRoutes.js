const express = require("express");
const { importData } = require("../controllers/importController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
// const multer = require("multer");

// const upload = multer({ dest: "uploads/" });
// const router = express.Router();

// router.post("/", authMiddleware, roleMiddleware("admin"), upload.single("file"), importData);

module.exports = router;