const Student = require("../models/Student");
const Class = require("../models/Class");
const Award = require("../models/Award");

exports.getStudents = async (req, res) => {
  const { classId, search, page = 1, limit = 10 } = req.query;

  try {
    let query = {};
    if (classId) query.classId = classId;
    if (search) query.name = { $regex: search, $options: "i" };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const students = await Student.find(query)
      .populate("classId")
      .populate("awards")
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Student.countDocuments(query);

    res.json({ students, total });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createStudent = async (req, res) => {
  const { name, classId, notes } = req.body;

  try {
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    const student = new Student({ name, classId, notes });
    await student.save();

    await Class.findByIdAndUpdate(
      classId,
      { $push: { students: student._id }, $inc: { totalStudents: 1 } },
      { new: true }
    );

    const populatedStudent = await Student.findById(student._id)
      .populate("classId")
      .populate("awards")
      .lean();

    res.status(201).json(populatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { name, classId, notes } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const oldClassId = student.classId;
    student.name = name || student.name;
    student.classId = classId || student.classId;
    student.notes = notes || student.notes;
    await student.save();

    if (oldClassId?.toString() !== classId) {
      // Remove student from old class
      await Class.findByIdAndUpdate(
        oldClassId,
        { $pull: { students: student._id }, $inc: { totalStudents: -1 } },
        { new: true }
      );
      // Add student to new class
      await Class.findByIdAndUpdate(
        classId,
        { $push: { students: student._id }, $inc: { totalStudents: 1 } },
        { new: true }
      );
    }

    const updatedStudent = await Student.findById(studentId)
      .populate("classId")
      .populate("awards")
      .lean();

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Class.findByIdAndUpdate(
      student.classId,
      { $pull: { students: student._id }, $inc: { totalStudents: -1 } },
      { new: true }
    );

    await Student.findByIdAndDelete(studentId);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.awardBadge = async (req, res) => {
  const { studentId, badgeId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const award = await Award.findById(badgeId);
    if (!award) {
      return res.status(404).json({ message: "Award not found" });
    }

    await Student.findByIdAndUpdate(
      studentId,
      { $addToSet: { awards: award._id } },
      { new: true }
    );

    await Award.findByIdAndUpdate(
      badgeId,
      { $addToSet: { studentsAwarded: student._id } },
      { new: true }
    );

    res.json({ message: "Badge awarded" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};