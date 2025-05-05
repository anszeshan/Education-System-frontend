const Activity = require("../models/Activity");
const Student = require("../models/Student");
const Class = require("../models/Class");
const Guide = require("../models/User");
const Event = require("../models/Event");

exports.getMetrics = async (req, res) => {
  try {
    const totalActivities = await Activity.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalClasses = await Class.countDocuments();
    const totalGuides = await Guide.countDocuments();

    // Calculate percentage change for activities and students (example logic)
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonthActivities = await Activity.countDocuments({
      date: { $gte: lastMonthStart },
    });
    const previousMonthStart = new Date(lastMonthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    const previousMonthActivities = await Activity.countDocuments({
      date: { $gte: previousMonthStart, $lt: lastMonthStart },
    });

    const lastMonthStudents = await Student.countDocuments({
      createdAt: { $gte: lastMonthStart },
    });
    const previousMonthStudents = await Student.countDocuments({
      createdAt: { $gte: previousMonthStart, $lt: lastMonthStart },
    });

    const activityChange = previousMonthActivities
      ? Math.round(((lastMonthActivities - previousMonthActivities) / previousMonthActivities) * 100)
      : 0;
    const studentChange = previousMonthStudents
      ? Math.round(((lastMonthStudents - previousMonthStudents) / previousMonthStudents) * 100)
      : 0;

    res.json({
      totalActivities,
      totalStudents,
      totalClasses,
      totalGuides,
      activityChange,
      studentChange,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWeeklyActivities = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    const activities = await Activity.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill in all days of the week, even if there are no activities
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const dateStr = currentDay.toISOString().split("T")[0];
      const activity = activities.find((a) => a._id === dateStr);
      days.push({
        date: currentDay,
        count: activity ? activity.count : 0,
      });
    }

    res.json({ days });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const events = await Event.find({
      dateTime: { $gte: today, $lte: nextWeek },
    })
      .populate("classId", "name")
      .lean();

    const formattedEvents = events.map((event) => ({
      _id: event._id,
      title: event.title,
      className: event.classId?.name || "N/A",
      dateTime: event.dateTime,
    }));

    res.json({ events: formattedEvents });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getStudentPerformance = async (req, res) => {
  try {
    const students = await Student.aggregate([
      { $match: { "grades": { $exists: true } } },
      {
        $group: {
          _id: null,
          averageGrade: { $avg: "$grades" },
          topStudents: { $push: { name: "$name", grade: "$grades" } },
        },
      },
      { $project: { _id: 0, averageGrade: 1, topStudents: { $slice: ["$topStudents", 5] } } },
    ]);
    res.json({
      averageGrade: students[0]?.averageGrade || 0,
      topStudents: students[0]?.topStudents || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGuideActivity = async (req, res) => {
  try {
    const activeGuides = await Guide.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    const totalSessions = await Activity.countDocuments({ guideId: { $exists: true } });
    res.json({ activeGuides, totalSessions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSystemHealth = async (req, res) => {
  try {
    
    const uptime = Math.floor(Math.random() * 100); // Hours
    const errors = Math.floor(Math.random() * 10); // Error count
    res.json({ uptime, errors });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};