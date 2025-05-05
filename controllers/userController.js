// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// // Get logged-in user's profile
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findOne({ userId: req.user.userId })
//       .populate("classes")
//       .lean();
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Update logged-in user's profile
// exports.updateProfile = async (req, res) => {
//   const { name, email, phone, bio, subjects, yearsOfExperience, notificationSettings, securitySettings } = req.body;

//   try {
//     const user = await User.findOneAndUpdate(
//       { userId: req.user.userId },
//       { name, email, phone, bio, subjects, yearsOfExperience, notificationSettings, securitySettings },
//       { new: true }
//     )
//       .populate("classes")
//       .lean();
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Change logged-in user's password
// exports.changePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ userId: req.user.userId });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Current password is incorrect" });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();
//     res.json({ message: "Password changed successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get all users (for admin, with role filter, search, and pagination)
// exports.getUsers = async (req, res) => {
//   try {
//     const { role, search = "", page = 1, limit = 10 } = req.query;

//     // Build query
//     const query = {};
//     if (role) {
//       query.role = role;
//     }
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     const pageNum = parseInt(page);
//     const limitNum = parseInt(limit);
//     const skip = (pageNum - 1) * limitNum;

//     const users = await User.find(query)
//       .populate("classes")
//       .skip(skip)
//       .limit(limitNum)
//       .lean();

//     const total = await User.countDocuments(query);

//     res.json({
//       users,
//       total,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Create a new user (admin only)
// exports.createUser = async (req, res) => {
//   const { name, email, password, role, phone, subjects } = req.body;

//   try {
//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Generate a unique userId
//     const lastUser = await User.findOne().sort({ userId: -1 });
//     const newUserId = lastUser ? parseInt(lastUser.userId) + 1 : 1;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       userId: newUserId.toString(),
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       phone,
//       subjects: subjects || [],
//     });

//     await user.save();
//     const userResponse = await User.findOne({ userId: newUserId })
//       .populate("classes")
//       .lean();
//     res.status(201).json(userResponse);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Update a user by userId (admin only)
// exports.updateUser = async (req, res) => {
//   const { userId } = req.params;
//   const { name, email, phone, subjects } = req.body;

//   try {
//     const user = await User.findOneAndUpdate(
//       { userId },
//       { name, email, phone, subjects },
//       { new: true }
//     )
//       .populate("classes")
//       .lean();

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete a user by userId (admin only)
// exports.deleteUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findOneAndDelete({ userId });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId })
      .populate("classes")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update logged-in user's profile
exports.updateProfile = async (req, res) => {
  const { name, email, phone, bio, subjects, yearsOfExperience, notificationSettings, securitySettings } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { name, email, phone, bio, subjects, yearsOfExperience, notificationSettings, securitySettings },
      { new: true }
    )
      .populate("classes")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Change logged-in user's password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (for admin, with role filter, search, and pagination)
exports.getUsers = async (req, res) => {
  try {
    const { role, search = "", page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .populate("classes")
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new user (admin only)
exports.createUser = async (req, res) => {
  const { name, email, password, role, phone, subjects, classes } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate a unique userId
    const lastUser = await User.findOne().sort({ userId: -1 });
    const newUserId = lastUser ? parseInt(lastUser.userId) + 1 : 1;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userId: newUserId.toString(),
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      subjects: subjects || [],
      classes: classes || [], // Save the array of class IDs
    });

    await user.save();
    const userResponse = await User.findOne({ userId: newUserId })
      .populate("classes")
      .lean();
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user by userId (admin only)
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone, subjects, classes } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { name, email, phone, subjects, classes }, // Update the classes field
      { new: true }
    )
      .populate("classes")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by userId (admin only)
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOneAndDelete({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};