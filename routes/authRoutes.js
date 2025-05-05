const express = require("express");
const { register, login } = require("../controllers/authController");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("role", "Role must be admin or guide").isIn(["admin", "guide"]),
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
    check("role", "Role must be admin or guide").isIn(["admin", "guide"]),
  ],
  login
);

module.exports = router;