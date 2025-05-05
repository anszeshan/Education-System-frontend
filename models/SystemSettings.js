const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema({
  adminId: { type: Number, ref: "User", required: true },
  language: { type: String, default: "en" },
  timezone: { type: String, default: "America/New_York" },
  dateFormat: { type: String, default: "MM/DD/YYYY" },
  timeFormat: { type: String, default: "12h" },
  academicYear: { type: String, default: "2024-2025" },
});

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);