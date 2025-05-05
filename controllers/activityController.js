const Activity = require("../models/Activity");

// exports.getActivities = async (req, res) => {
//   const { category, search } = req.query;
//   try {
//     let query = {};
//     if (category && category !== "all") query.category = category;
//     if (search) query.description = { $regex: search, $options: "i" };
//     if (req.user.role === "guide") query.assignedGuides = req.user.userId;

//     const activities = await Activity.find(query)
//       .populate("eligibleClasses", "name")
//       .populate("assignedGuides", "name")
//       .lean();
//     res.json(activities);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.getActivities = async (req, res) => {
  const { category, search } = req.query;

  try {
    let query = {};

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Search by description (case-insensitive)
    if (search) {
      query.description = { $regex: search, $options: "i" };
    }

    // Filter by assigned guide if the user is a guide
    // if (req.user.role === "guide") {
    //   query.assignedGuides = { $in: [req.user.userId] };
    // }

    const activities = await Activity.find(query)
      .populate("eligibleClasses", "name")
      .populate("assignedGuides", "name")
      .lean();

    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createActivity = async (req, res) => {
  const { name, description, category, eligibleClasses, assignedGuides } = req.body;

  try {
    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }
    if (!["academic", "creative", "physical"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const activity = new Activity({
      name,
      description: description || "",
      category,
      eligibleClasses: eligibleClasses || [],
      assignedGuides: assignedGuides || [],
    });
    await activity.save();
    const populatedActivity = await Activity.findById(activity._id)
      .populate("eligibleClasses", "name")
      .populate("assignedGuides", "name")
      .lean();
    res.status(201).json(populatedActivity);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateActivity = async (req, res) => {
  const { id } = req.params; // Use _id instead of activityId
  const { name, description, category, eligibleClasses, assignedGuides } = req.body;

  try {
    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }
    if (!["academic", "creative", "physical"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      {
        name,
        description: description || "",
        category,
        eligibleClasses: eligibleClasses || [],
        assignedGuides: assignedGuides || [],
      },
      { new: true }
    )
      .populate("eligibleClasses", "name")
      .populate("assignedGuides", "name")
      .lean();

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteActivity = async (req, res) => {
  const { id } = req.params; // Use _id instead of activityId

  try {
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};