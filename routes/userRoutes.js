const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Routes for logged-in user to manage their own profile
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

// Routes for admin to manage users (guides)
router.get("/", authMiddleware, adminMiddleware, getUsers); // Fetch all users with role filter
router.post("/", authMiddleware, adminMiddleware, createUser); // Create a new user (guide)
router.put("/:userId", authMiddleware, adminMiddleware, updateUser); // Update a user by userId
router.delete("/:userId", authMiddleware, adminMiddleware, deleteUser); // Delete a user by userId

module.exports = router;