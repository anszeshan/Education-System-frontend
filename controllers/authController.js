const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    await user.save();

    const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, redirect: role === "admin" ? "/admin/dashboard" : "/guide/dashboard" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials testing" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      user: {
        _id: user._id, // Include the MongoDB ObjectId
        userId: user.userId, // Include the custom userId if different
        email: user.email,
        role: user.role,
      },
      redirect: role === "admin" ? "/admin/dashboard" : "/guide/dashboard",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};