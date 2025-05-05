const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "guide", "student"], required: true },
  phone: String,
  bio: String,
  avatar: String,
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  yearsOfExperience: String,
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    activitySummary: { type: Boolean, default: true },
    attendanceAlerts: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: false },
    activityReminders: { type: Boolean, default: true },
  },
  securitySettings: {
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 },
    passwordExpiry: { type: String, default: "90" },
  },
});

// Auto-increment userId
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastUser = await mongoose.model("User").findOne().sort({ userId: -1 });
    this.userId = lastUser ? lastUser.userId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);