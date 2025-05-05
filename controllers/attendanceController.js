const AttendanceRecord = require("../models/AttendanceRecord");
const Class = require("../models/Class");
const Student = require("../models/Student");

exports.markAttendance = async (req, res) => {
  const { classId, date, sessionNotes, attendance } = req.body;

  try {
    if (!classId || !date || !attendance) {
      return res.status(400).json({ message: "classId, date, and attendance are required" });
    }

    const studentIds = Object.keys(attendance).map((id) => parseInt(id));
    const updates = studentIds.map((studentId) => {
      const { present, notes } = attendance[studentId];
      const status = present ? "present" : "absent";
      return {
        updateOne: {
          filter: { studentId: studentId.toString() },
          update: {
            $push: {
              attendanceRecords: {
                date: new Date(date),
                status,
                notes: notes || "",
              },
            },
          },
        },
      };
    });

    if (updates.length > 0) {
      await Student.bulkWrite(updates);
    }

    // Optionally store session notes (could be in a separate Session model)
    if (sessionNotes) {
      console.log("Session Notes:", sessionNotes); // For now, log session notes
      // You could create a Session model to store this if needed
    }

    res.status(201).json({ message: "Attendance recorded successfully" });
  } catch (err) {
    console.error("Error in markAttendance:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get attendance data for classes with pagination, filtering, and time range
exports.getAttendance = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, timeRange = "month", classId } = req.query;

    // Calculate the start date based on the time range
    const today = new Date();
    let startDate = new Date(today);
    if (timeRange === "week") {
      startDate.setDate(today.getDate() - 7);
    } else if (timeRange === "month") {
      startDate.setMonth(today.getMonth() - 1);
    } else if (timeRange === "quarter") {
      startDate.setMonth(today.getMonth() - 3);
    } else if (timeRange === "year") {
      startDate.setFullYear(today.getFullYear() - 1);
    }
    startDate.setHours(0, 0, 0, 0);

    // Build class query
    const classQuery = {};
    if (classId) {
      classQuery._id = classId;
    }
    if (search) {
      classQuery.name = { $regex: search, $options: "i" };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch classes
    const classes = await Class.find(classQuery)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalClasses = await Class.countDocuments(classQuery);

    // Fetch attendance records for the time range
    const attendanceData = await Promise.all(
      classes.map(async (classItem) => {
        const classId = classItem._id;
        const totalStudents = classItem.totalStudents || 0;

        // Fetch attendance records for this class
        const records = await AttendanceRecord.find({
          classId,
          date: { $gte: startDate, $lte: today },
        }).lean();

        // Calculate average attendance
        const totalRecords = records.length;
        const presentRecords = records.filter((r) => r.status === "present").length;
        const averageAttendance = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

        // Get the last activity date
        const lastActivityRecord = records[records.length - 1];
        const lastActivity = lastActivityRecord ? lastActivityRecord.date : null;

        // Calculate trend (compare last two periods)
        let trend = "stable";
        if (timeRange === "week") {
          const midPoint = new Date(startDate);
          midPoint.setDate(midPoint.getDate() + 3);

          const firstHalfRecords = records.filter((r) => new Date(r.date) < midPoint);
          const secondHalfRecords = records.filter((r) => new Date(r.date) >= midPoint);

          const firstHalfPresent = firstHalfRecords.filter((r) => r.status === "present").length;
          const secondHalfPresent = secondHalfRecords.filter((r) => r.status === "present").length;

          const firstHalfAvg = firstHalfRecords.length > 0 ? (firstHalfPresent / firstHalfRecords.length) * 100 : 0;
          const secondHalfAvg = secondHalfRecords.length > 0 ? (secondHalfPresent / secondHalfRecords.length) * 100 : 0;

          if (secondHalfAvg > firstHalfAvg + 2) trend = "up";
          else if (secondHalfAvg < firstHalfAvg - 2) trend = "down";
        } else {
          const midPoint = new Date(startDate);
          if (timeRange === "month") midPoint.setDate(midPoint.getDate() + 15);
          else if (timeRange === "quarter") midPoint.setMonth(midPoint.getMonth() + 1.5);
          else if (timeRange === "year") midPoint.setMonth(midPoint.getMonth() + 6);

          const firstHalfRecords = records.filter((r) => new Date(r.date) < midPoint);
          const secondHalfRecords = records.filter((r) => new Date(r.date) >= midPoint);

          const firstHalfPresent = firstHalfRecords.filter((r) => r.status === "present").length;
          const secondHalfPresent = secondHalfRecords.filter((r) => r.status === "present").length;

          const firstHalfAvg = firstHalfRecords.length > 0 ? (firstHalfPresent / firstHalfRecords.length) * 100 : 0;
          const secondHalfAvg = secondHalfRecords.length > 0 ? (secondHalfPresent / secondHalfRecords.length) * 100 : 0;

          if (secondHalfAvg > firstHalfAvg + 2) trend = "up";
          else if (secondHalfAvg < firstHalfAvg - 2) trend = "down";
        }

        return {
          id: classItem._id,
          class: classItem.name,
          totalStudents,
          averageAttendance: averageAttendance.toFixed(1),
          lastActivity,
          trend,
        };
      })
    );

    res.json({
      attendanceData,
      total: totalClasses,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get attendance summary metrics
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { timeRange = "month" } = req.query;

    // Calculate the start date based on the time range
    const today = new Date();
    let startDate = new Date(today);
    if (timeRange === "week") {
      startDate.setDate(today.getDate() - 7);
    } else if (timeRange === "month") {
      startDate.setMonth(today.getMonth() - 1);
    } else if (timeRange === "quarter") {
      startDate.setMonth(today.getMonth() - 3);
    } else if (timeRange === "year") {
      startDate.setFullYear(today.getFullYear() - 1);
    }
    startDate.setHours(0, 0, 0, 0);

    // Fetch summary metrics
    const totalClasses = await Class.countDocuments();
    const totalStudents = await Student.countDocuments();

    const records = await AttendanceRecord.find({
      date: { $gte: startDate, $lte: today },
    }).lean();

    const totalRecords = records.length;
    const presentRecords = records.filter((r) => r.status === "present").length;
    const averageAttendance = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

    // Calculate overall trend
    let trend = "stable";
    const midPoint = new Date(startDate);
    if (timeRange === "week") midPoint.setDate(midPoint.getDate() + 3);
    else if (timeRange === "month") midPoint.setDate(midPoint.getDate() + 15);
    else if (timeRange === "quarter") midPoint.setMonth(midPoint.getMonth() + 1.5);
    else if (timeRange === "year") midPoint.setMonth(midPoint.getMonth() + 6);

    const firstHalfRecords = records.filter((r) => new Date(r.date) < midPoint);
    const secondHalfRecords = records.filter((r) => new Date(r.date) >= midPoint);

    const firstHalfPresent = firstHalfRecords.filter((r) => r.status === "present").length;
    const secondHalfPresent = secondHalfRecords.filter((r) => r.status === "present").length;

    const firstHalfAvg = firstHalfRecords.length > 0 ? (firstHalfPresent / firstHalfRecords.length) * 100 : 0;
    const secondHalfAvg = secondHalfRecords.length > 0 ? (secondHalfPresent / secondHalfRecords.length) * 100 : 0;

    if (secondHalfAvg > firstHalfAvg + 2) trend = "up";
    else if (secondHalfAvg < firstHalfAvg - 2) trend = "down";

    res.json({
      totalClasses,
      totalStudents,
      averageAttendance: averageAttendance.toFixed(1),
      trend,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get attendance trend data for chart
exports.getAttendanceTrend = async (req, res) => {
  try {
    const { timeRange = "month", classId } = req.query;

    // Calculate the start date based on the time range
    const today = new Date();
    let startDate = new Date(today);
    let interval = "day"; // Default to daily intervals
    let intervalsCount = 30; // Default for month

    if (timeRange === "week") {
      startDate.setDate(today.getDate() - 7);
      intervalsCount = 7;
    } else if (timeRange === "month") {
      startDate.setMonth(today.getMonth() - 1);
      intervalsCount = 30;
    } else if (timeRange === "quarter") {
      startDate.setMonth(today.getMonth() - 3);
      intervalsCount = 12; // Weekly intervals
      interval = "week";
    } else if (timeRange === "year") {
      startDate.setFullYear(today.getFullYear() - 1);
      intervalsCount = 12; // Monthly intervals
      interval = "month";
    }
    startDate.setHours(0, 0, 0, 0);

    // Build query
    const query = { date: { $gte: startDate, $lte: today } };
    if (classId) {
      query.classId = classId;
    }

    const records = await AttendanceRecord.find(query).lean();

    // Group records by interval
    const trendData = [];
    for (let i = 0; i < intervalsCount; i++) {
      let intervalStart = new Date(startDate);
      let intervalEnd = new Date(startDate);

      if (interval === "day") {
        intervalStart.setDate(startDate.getDate() + i);
        intervalEnd.setDate(startDate.getDate() + i + 1);
      } else if (interval === "week") {
        intervalStart.setDate(startDate.getDate() + i * 7);
        intervalEnd.setDate(startDate.getDate() + (i + 1) * 7);
      } else if (interval === "month") {
        intervalStart.setMonth(startDate.getMonth() + i);
        intervalEnd.setMonth(startDate.getMonth() + i + 1);
      }

      const intervalRecords = records.filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate >= intervalStart && recordDate < intervalEnd;
      });

      const total = intervalRecords.length;
      const present = intervalRecords.filter((r) => r.status === "present").length;
      const attendanceRate = total > 0 ? (present / total) * 100 : 0;

      trendData.push({
        label:
          interval === "day"
            ? intervalStart.toLocaleDateString("en-US", { day: "numeric", month: "short" })
            : interval === "week"
            ? `Week ${i + 1}`
            : intervalStart.toLocaleDateString("en-US", { month: "short" }),
        attendanceRate: attendanceRate.toFixed(1),
      });
    }

    res.json({ trendData });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};