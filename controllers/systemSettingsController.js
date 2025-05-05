const SystemSettings = require("../models/SystemSettings");

exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne({ adminId: req.user.userId });
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSystemSettings = async (req, res) => {
  const { language, timezone, dateFormat, timeFormat, academicYear } = req.body;

  try {
    let settings = await SystemSettings.findOne({ adminId: req.user.userId });
    if (!settings) {
      settings = new SystemSettings({ adminId: req.user.userId });
    }

    settings.language = language || settings.language;
    settings.timezone = timezone || settings.timezone;
    settings.dateFormat = dateFormat || settings.dateFormat;
    settings.timeFormat = timeFormat || settings.timeFormat;
    settings.academicYear = academicYear || settings.academicYear;

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};