const Student = require("../models/Student");
const Class = require("../models/Class");
const User = require("../models/User");
const Activity = require("../models/Activity");
const csvParser = require("../utils/csvParser");
const emailService = require("../utils/emailService");

exports.importData = async (req, res) => {
  const { type } = req.query;
  const file = req.file;

  try {
    const data = await csvParser(file.path);

    if (type === "students") {
      const students = data.map((row) => ({
        name: row.name,
        classId: row.classId,
        notes: row.notes,
      }));

      const insertedStudents = await Student.insertMany(students);

      await Class.bulkWrite(
        insertedStudents.map((student) => ({
          updateOne: {
            filter: { classId: student.classId },
            update: { $push: { students: student.studentId }, $inc: { totalStudents: 1 } },
          },
        }))
      );
    } else if (type === "guides") {
      const guides = data.map((row) => ({
        name: row.name,
        email: row.email,
        password: row.password,
        role: "guide",
        phone: row.phone,
      }));

      const insertedGuides = await User.insertMany(guides);
      insertedGuides.forEach((guide) => {
        emailService.sendInvite(guide.email, guide.name);
      });
    } else if (type === "classes") {
      const classes = data.map((row) => ({
        name: row.name,
        assignedGuides: row.assignedGuides.split(","),
        activities: row.activities.split(","),
      }));

      await Class.insertMany(classes);
    } else if (type === "activities") {
      const activities = data.map((row) => ({
        name: row.name,
        description: row.description,
        category: row.category,
        eligibleClasses: row.eligibleClasses.split(","),
        assignedGuides: row.assignedGuides.split(","),
      }));

      await Activity.insertMany(activities);
    }

    res.json({ message: "Data imported successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};