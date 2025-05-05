const Award = require("../models/Award");
const Student = require("../models/Student");

exports.getAwards = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  try {
    let query = {};
    if (search) query.name = { $regex: search, $options: "i" };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const awards = await Award.find(query)
      .populate("studentsAwarded", "name classId")
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Award.countDocuments(query);

    res.json({ awards, total });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentsForAward = async (req, res) => {
  const { awardId } = req.params;

  try {
    const award = await Award.findOne({ awardId })
      .populate("studentsAwarded", "name classId")
      .lean();

    if (!award) {
      return res.status(404).json({ message: "Award not found" });
    }

    res.json(award.studentsAwarded || []);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createAward = async (req, res) => {
  const { name, description, criteria, icon } = req.body;

  try {
    const award = new Award({ name, description, criteria, icon, studentsAwarded: [] });
    await award.save();
    res.status(201).json(award);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAward = async (req, res) => {
  const { awardId } = req.params;
  const { name, description, criteria, icon } = req.body;

  try {
    const award = await Award.findOne({ awardId });
    if (!award) {
      return res.status(404).json({ message: "Award not found" });
    }

    award.name = name || award.name;
    award.description = description || award.description;
    award.criteria = criteria || award.criteria;
    award.icon = icon || award.icon;

    await award.save();
    const updatedAward = await Award.findOne({ awardId })
      .populate("studentsAwarded", "name classId")
      .lean();
    res.json(updatedAward);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAward = async (req, res) => {
  const { awardId } = req.params;

  try {
    const award = await Award.findOne({ awardId });
    if (!award) {
      return res.status(404).json({ message: "Award not found" });
    }

    // Remove the award from any student's awards list (if implemented in Student model)
    await Student.updateMany(
      { awards: award._id },
      { $pull: { awards: award._id } }
    );

    await Award.findOneAndDelete({ awardId });
    res.json({ message: "Award deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};