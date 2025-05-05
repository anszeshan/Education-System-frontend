const BadgeAward = require("../models/BadgeAward");
const Award = require("../models/Award");
const Student = require("../models/Student");
const mongoose = require("mongoose");

exports.createBadgeAward = async (req, res) => {
  const { guideId, awardId, studentIds, note } = req.body;

  try {
    // Validate input
    if (!awardId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "awardId and studentIds are required" });
    }

    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(awardId)) {
      return res.status(400).json({ message: "Invalid awardId" });
    }
    if (studentIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "One or more studentIds are invalid" });
    }
    // if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
    //   return res.status(400).json({ message: "Invalid guideId" });
    // }

    // Convert string IDs to ObjectId
    const awardObjectId = new mongoose.Types.ObjectId(awardId);
    const studentObjectIds = studentIds.map((id) => new mongoose.Types.ObjectId(id));
    // const guideObjectId = new mongoose.Types.ObjectId(req.user.userId);

    // Create badge award entries
    const badgeAwards = studentObjectIds.map((studentId) => ({
      badgeId: awardObjectId,
      studentId,
      guideId,
      note,
    }));

    // Insert badge awards
    await BadgeAward.insertMany(badgeAwards);

    // Update Award to include students
    await Award.findByIdAndUpdate(
      awardObjectId,
      { $addToSet: { studentsAwarded: { $each: studentObjectIds } } },
      { new: true }
    );

    // Update Students to include award
    await Student.updateMany(
      { _id: { $in: studentObjectIds } },
      { $addToSet: { awards: awardObjectId } }
    );

    res.status(201).json({ message: "Badges awarded successfully" });
  } catch (err) {
    console.error("Error in createBadgeAward:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getBadgeAwards = async (req, res) => {
  try {
    const badgeAwards = await BadgeAward.find({ guideId: req.user.userId })
      .populate("badgeId studentId")
      .sort({ date: -1 });
    res.json(badgeAwards);
  } catch (err) {
    console.error("Error in getBadgeAwards:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};