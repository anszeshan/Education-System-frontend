const Class = require("../models/Class");
const User = require("../models/User");
const Activity = require("../models/Activity");


exports.getClasses = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  try {
    let query = {};
    if (search) query.name = { $regex: search, $options: "i" };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const classes = await Class.find(query)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Class.countDocuments(query);

    res.json(classes);
  } catch (err) {
    console.error("Error in getClasses:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createClass = async (req, res) => {
  const { name, assignedGuides, activities } = req.body;

  try {
    // Validate assignedGuides
    if (assignedGuides && assignedGuides.length > 0) {
      const guides = await User.find({ _id: { $in: assignedGuides }, role: "guide" });
      if (guides.length !== assignedGuides.length) {
        return res.status(400).json({ message: "One or more invalid guide IDs" });
      }
    }

    // Validate activities
    if (activities && activities.length > 0) {
      const validActivities = await Activity.find({ _id: { $in: activities } });
      if (validActivities.length !== activities.length) {
        return res.status(400).json({ message: "One or more invalid activity IDs" });
      }
    }

    const newClass = new Class({
      name,
      assignedGuides: assignedGuides || [],
      activities: activities || [],
      totalStudents: 0,
    });

    await newClass.save();

    const populatedClass = await Class.findById(newClass._id)
      .populate("assignedGuides", "name")
      .populate("activities", "name")
      .populate("students")
      .lean();

    res.status(201).json(populatedClass);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateClass = async (req, res) => {
 // const { classId } = req.params;
  const { classID, name, assignedGuides, activities } = req.body;

  try {
    const classToUpdate = await Class.findOne({ classID });
    if (!classToUpdate) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Validate assignedGuides
    if (assignedGuides && assignedGuides.length > 0) {
      const guides = await User.find({ _id: { $in: assignedGuides }, role: "guide" });
      if (guides.length !== assignedGuides.length) {
        return res.status(400).json({ message: "One or more invalid guide IDs" });
      }
    }

    // Validate activities
    if (activities && activities.length > 0) {
      const validActivities = await Activity.find({ _id: { $in: activities } });
      if (validActivities.length !== activities.length) {
        return res.status(400).json({ message: "One or more invalid activity IDs" });
      }
    }

    classToUpdate.classId = classID || classToUpdate.classId;
    classToUpdate.name = name || classToUpdate.name;
    classToUpdate.assignedGuides = assignedGuides || classToUpdate.assignedGuides;
    classToUpdate.activities = activities || classToUpdate.activities;

    await classToUpdate.save();

    const updatedClass = await Class.findOne({ classId })
      .populate("assignedGuides", "name")
      .populate("activities", "name")
      .populate("students")
      .lean();

    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const classToDelete = await Class.findOne({ classId });
    if (!classToDelete) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Optional: Remove class reference from students
    await Student.updateMany(
      { classId: classToDelete._id },
      { $unset: { classId: "" } }
    );

    await Class.findOneAndDelete({ classId });
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};