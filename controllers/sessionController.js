const Session = require("../models/Session");
const Student = require("../models/Student");

exports.createSession = async (req, res) => {
  const { classId, date, sessionNotes, attendanceData } = req.body;

  try {
    const session = new Session({
      classId,
      date,
      guideId: req.user.userId,
      sessionNotes,
    });
    await session.save();

    const updates = Object.keys(attendanceData).map((studentId) => ({
      updateOne: {
        filter: { studentId },
        update: {
          $push: {
            attendanceRecords: {
              date,
              status: attendanceData[studentId].present ? "present" : "absent",
              notes: attendanceData[studentId].notes,
            },
          },
        },
      },
    }));

    await Student.bulkWrite(updates);
    res.status(201).json({ message: "Attendance recorded" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSessions = async (req, res) => {
  const { classId, date } = req.query;

  try {
    let query = { guideId: req.user.userId };
    if (classId) query.classId = classId;
    if (date) query.date = { $gte: new Date(date), $lte: new Date(date) };

    const sessions = await Session.find(query).populate("classId");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};