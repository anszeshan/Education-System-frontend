// controllers/activityLogController.js
const ActivityLog = require("../models/ActivityLog");
const mongoose = require("mongoose");

exports.createActivityLog = async (req, res) => {
  const { guideId, activityId, classId, topic, description, notes, date, startTime, endTime } = req.body;

  try {
    // Validate required fields
    if (!activityId || !classId || !topic || !description || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Ensure ObjectId fields are valid
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ message: "Invalid activityId" });
    }
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid classId" });
    }
    // if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
    //   return res.status(400).json({ message: "Invalid guideId" });
    // }

    const activityLog = new ActivityLog({
      activityId,
      classId,
      guideId,
      topic,
      description,
      notes,
      date,
      startTime,
      endTime,
    });

    await activityLog.save();
    res.status(201).json(activityLog);
  } catch (err) {
    console.error("Error saving activity log:", err); // Log the detailed error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getActivityLogs = async (req, res) => {
  const { classId, date } = req.query;

  try {
    let query = { guideId: req.user.userId };
    if (classId) query.classId = classId;
    if (date) query.date = { $gte: new Date(date), $lte: new Date(date) };

    const logs = await ActivityLog.find(query).populate("activityId classId");
    res.json(logs);
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};