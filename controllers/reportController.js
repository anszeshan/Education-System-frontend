const ActivityLog = require("../models/ActivityLog");
const Session = require("../models/Session");
const Student = require("../models/Student");
const Class = require("../models/Class");
const { format, parseISO, differenceInMinutes } = require("date-fns");

exports.getActivityReports = async (req, res) => {
  const { classId, date, search } = req.query;

  try {
    let query = {};
    if (req.user.role !== "admin") {
      query.guideId = req.user.userId;
    }
    if (classId && classId !== "all") query.classId = classId;
    if (date) query.date = { $gte: new Date(date), $lte: new Date(date) };
    if (search) {
      query.$or = [
        { topic: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const logs = await ActivityLog.find(query)
      .populate("classId", "name")
      .populate("activityId", "name")
      .populate("guideId", "name")
      .lean();

    const reports = await Promise.all(
      logs.map(async (log) => {
        const students = await Student.find({ classId: log.classId }).lean();
        const presentStudents = students.filter((student) =>
          student.attendanceRecords.some(
            (record) => new Date(record.date).toDateString() === new Date(log.date).toDateString() && record.status === "present"
          )
        ).length;
        const attendanceRate = students.length > 0 ? ((presentStudents / students.length) * 100).toFixed(1) : 0;

        const duration = differenceInMinutes(
          new Date(`1970-01-01T${log.endTime}:00`),
          new Date(`1970-01-01T${log.startTime}:00`)
        );

        return {
          id: log.activityLogId,
          activity: log.activityId?.name || "N/A",
          class: log.classId?.name || "N/A",
          guide: log.guideId?.name || "N/A",
          date: log.date,
          topic: log.topic,
          duration: `${duration} min`,
          attendanceRate: `${attendanceRate}%`,
        };
      })
    );

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAttendanceReports = async (req, res) => {
  const { classId, date } = req.query;

  try {
    let query = {};
    if (req.user.role !== "admin") {
      query.guideId = req.user.userId;
    }
    if (classId && classId !== "all") query.classId = classId;
    if (date) query.date = { $gte: new Date(date), $lte: new Date(date) };

    const sessions = await Session.find(query)
      .populate("classId", "name")
      .populate("guideId", "name")
      .lean();
    const logs = await ActivityLog.find(query)
      .populate("activityId", "name")
      .lean();

    const reports = await Promise.all(
      sessions.map(async (session) => {
        const students = await Student.find({ classId: session.classId }).lean();
        const present = students.filter((student) =>
          student.attendanceRecords.some(
            (record) => new Date(record.date).toDateString() === new Date(session.date).toDateString() && record.status === "present"
          )
        ).length;
        const absent = students.length - present;

        const activityLog = logs.find(
          (log) => log.classId.toString() === session.classId.toString() && new Date(log.date).toDateString() === new Date(session.date).toDateString()
        );

        return {
          id: session.sessionId,
          class: session.classId?.name || "N/A",
          date: session.date,
          guide: session.guideId?.name || "N/A",
          activity: activityLog ? activityLog.activityId?.name : "N/A",
          totalStudents: students.length,
          present,
          absent,
          rate: students.length > 0 ? ((present / students.length) * 100).toFixed(1) + "%" : "0%",
        };
      })
    );

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentReports = async (req, res) => {
  const { classId, date } = req.query;

  try {
    let query = {};
    if (classId && classId !== "all") query.classId = classId;

    const students = await Student.find(query)
      .populate("classId", "name")
      .populate("awards", "name")
      .lean();

    if (!date) {
      return res.json(
        students.map((student) => ({
          id: student.studentId,
          name: student.name,
          class: student.classId?.name || "N/A",
          awards: student.awards?.map((award) => award.name).join(", ") || "None",
          attendanceRecords: student.attendanceRecords || [],
        }))
      );
    }

    const selectedDate = new Date(date);
    const reports = students.map((student) => {
      const attendanceRecord = student.attendanceRecords.find(
        (record) => new Date(record.date).toDateString() === selectedDate.toDateString()
      );
      return {
        id: student.studentId,
        name: student.name,
        class: student.classId?.name || "N/A",
        awards: student.awards?.map((award) => award.name).join(", ") || "None",
        status: attendanceRecord ? attendanceRecord.status : "N/A",
        notes: attendanceRecord ? attendanceRecord.notes || "None" : "None",
      };
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.exportReport = async (req, res) => {
  const { type, classId, date } = req.query;

  try {
    let data = [];
    if (type === "activity") {
      const reports = await ActivityLog.find(
        classId && classId !== "all"
          ? { classId, ...(date && { date: { $gte: new Date(date), $lte: new Date(date) } }) }
          : date
            ? { date: { $gte: new Date(date), $lte: new Date(date) } }
            : {}
      )
        .populate("classId", "name")
        .populate("activityId", "name")
        .populate("guideId", "name")
        .lean();

      data = await Promise.all(
        reports.map(async (log) => {
          const students = await Student.find({ classId: log.classId }).lean();
          const presentStudents = students.filter((student) =>
            student.attendanceRecords.some(
              (record) => new Date(record.date).toDateString() === new Date(log.date).toDateString() && record.status === "present"
            )
          ).length;
          const attendanceRate = students.length > 0 ? ((presentStudents / students.length) * 100).toFixed(1) : 0;

          const duration = differenceInMinutes(
            new Date(`1970-01-01T${log.endTime}:00`),
            new Date(`1970-01-01T${log.startTime}:00`)
          );

          return {
            Date: format(new Date(log.date), "yyyy-MM-dd"),
            Activity: log.activityId?.name || "N/A",
            Class: log.classId?.name || "N/A",
            Guide: log.guideId?.name || "N/A",
            Topic: log.topic,
            Duration: `${duration} min`,
            AttendanceRate: `${attendanceRate}%`,
          };
        })
      );
    } else if (type === "attendance") {
      const sessions = await Session.find(
        classId && classId !== "all"
          ? { classId, ...(date && { date: { $gte: new Date(date), $lte: new Date(date) } }) }
          : date
            ? { date: { $gte: new Date(date), $lte: new Date(date) } }
            : {}
      )
        .populate("classId", "name")
        .populate("guideId", "name")
        .lean();

      const logs = await ActivityLog.find(
        classId && classId !== "all"
          ? { classId, ...(date && { date: { $gte: new Date(date), $lte: new Date(date) } }) }
          : date
            ? { date: { $gte: new Date(date), $lte: new Date(date) } }
            : {}
      )
        .populate("activityId", "name")
        .lean();

      data = await Promise.all(
        sessions.map(async (session) => {
          const students = await Student.find({ classId: session.classId }).lean();
          const present = students.filter((student) =>
            student.attendanceRecords.some(
              (record) => new Date(record.date).toDateString() === new Date(session.date).toDateString() && record.status === "present"
            )
          ).length;
          const absent = students.length - present;

          const activityLog = logs.find(
            (log) => log.classId.toString() === session.classId.toString() && new Date(log.date).toDateString() === new Date(session.date).toDateString()
          );

          return {
            Date: format(new Date(session.date), "yyyy-MM-dd"),
            Class: session.classId?.name || "N/A",
            Guide: session.guideId?.name || "N/A",
            Activity: activityLog ? activityLog.activityId?.name : "N/A",
            TotalStudents: students.length,
            Present: present,
            Absent: absent,
            AttendanceRate: students.length > 0 ? ((present / students.length) * 100).toFixed(1) + "%" : "0%",
          };
        })
      );
    } else if (type === "student") {
      const students = await Student.find(
        classId && classId !== "all"
          ? { classId, ...(date && { date: { $gte: new Date(date), $lte: new Date(date) } }) }
          : date
            ? { date: { $gte: new Date(date), $lte: new Date(date) } }
            : {}
      )
        .populate("classId", "name")
        .populate("awards", "name")
        .lean();

      data = students.map((student) => {
        const attendanceRecord = date
          ? student.attendanceRecords.find(
              (record) => new Date(record.date).toDateString() === new Date(date).toDateString()
            )
          : null;

        return {
          StudentID: student.studentId,
          Name: student.name,
          Class: student.classId?.name || "N/A",
          Awards: student.awards?.map((award) => award.name).join(", ") || "None",
          Status: attendanceRecord ? attendanceRecord.status : "N/A",
          Notes: attendanceRecord ? attendanceRecord.notes || "None" : "None",
        };
      });
    }

    // Generate CSV content
    const headers = Object.keys(data[0] || {}).map((key) => ({ id: key, title: key }));
    const csvContent = [
      headers.map((h) => h.title).join(","),
      ...data.map((row) =>
        headers.map((h) => `"${String(row[h.id] || "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Send CSV as response
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${type}-report-${format(new Date(), "yyyyMMdd")}.csv`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Existing getAttendanceGraphData function remains unchanged
exports.getAttendanceGraphData = async (req, res) => {
  const { period = "weekly", date = new Date("2025-05-01").toISOString(), classId } = req.query;

  try {
    let startDate, endDate;
    const selectedDate = parseISO(date);

    if (period === "weekly") {
      startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
      endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
    } else if (period === "monthly") {
      startDate = startOfMonth(selectedDate);
      endDate = endOfMonth(selectedDate);
    } else if (period === "yearly") {
      startDate = startOfYear(selectedDate);
      endDate = endOfYear(selectedDate);
    } else if (period === "comparison") {
      startDate = startOfMonth(selectedDate);
      endDate = endOfMonth(selectedDate);
    } else {
      return res.status(400).json({ message: "Invalid period" });
    }

    let studentQuery = {};
    if (classId && classId !== "all-classes") {
      studentQuery.classId = classId;
    }

    const students = await Student.find(studentQuery)
      .populate("classId", "name")
      .lean();

    if (period === "weekly") {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const attendanceByDay = days.map((day) => {
        let totalStudents = 0;
        let presentStudents = 0;

        students.forEach((student) => {
          totalStudents++;
          const record = student.attendanceRecords.find((rec) =>
            new Date(rec.date).toDateString() === day.toDateString()
          );
          if (record?.status === "present") presentStudents++;
        });

        const attendanceRate = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
        return { day: format(day, "MMM d"), rate: attendanceRate, present: presentStudents, total: totalStudents };
      });

      const totalStudents = students.length;
      const perfectAttendance = students.filter((student) =>
        days.every((day) => {
          const record = student.attendanceRecords.find((rec) =>
            new Date(rec.date).toDateString() === day.toDateString()
          );
          return record?.status === "present";
        })
      ).length;
      const absentStudents = attendanceByDay[attendanceByDay.length - 1]?.total - attendanceByDay[attendanceByDay.length - 1]?.present || 0;
      const averageAttendance = attendanceByDay.reduce((sum, day) => sum + day.rate, 0) / days.length || 0;

      res.json({
        chartData: attendanceByDay.map((d) => ({ label: d.day, value: d.rate })),
        summary: {
          averageAttendance: averageAttendance.toFixed(1),
          perfectAttendance,
          absentStudents,
        },
        rawData: attendanceByDay,
      });
    } else if (period === "monthly") {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const attendanceByDay = days.map((day) => {
        let totalStudents = 0;
        let presentStudents = 0;

        students.forEach((student) => {
          totalStudents++;
          const record = student.attendanceRecords.find((rec) =>
            new Date(rec.date).toDateString() === day.toDateString()
          );
          if (record?.status === "present") presentStudents++;
        });

        const attendanceRate = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
        return { day: format(day, "MMM d"), rate: attendanceRate };
      });

      res.json({
        chartData: attendanceByDay.map((d) => ({ label: d.day, value: d.rate })),
      });
    } else if (period === "yearly") {
      const months = eachMonthOfInterval({ start: startDate, end: endDate });
      const attendanceByMonth = months.map((month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

        let totalDays = 0;
        let totalPresent = 0;

        students.forEach((student) => {
          days.forEach((day) => {
            totalDays++;
            const record = student.attendanceRecords.find((rec) =>
              new Date(rec.date).toDateString() === day.toDateString()
            );
            if (record?.status === "present") totalPresent++;
          });
        });

        const attendanceRate = totalDays > 0 ? (totalPresent / totalDays) * 100 : 0;
        return { month: format(month, "MMM"), rate: attendanceRate };
      });

      res.json({
        chartData: attendanceByMonth.map((m) => ({ label: m.month, value: m.rate })),
      });
    } else if (period === "comparison") {
      const classes = await Class.find().lean();
      const attendanceByClass = await Promise.all(
        classes.map(async (cls) => {
          const classStudents = await Student.find({ classId: cls._id }).lean();
          const days = eachDayOfInterval({ start: startDate, end: endDate });

          let totalDays = 0;
          let totalPresent = 0;

          classStudents.forEach((student) => {
            days.forEach((day) => {
              totalDays++;
              const record = student.attendanceRecords.find((rec) =>
                new Date(rec.date).toDateString() === day.toDateString()
              );
              if (record?.status === "present") totalPresent++;
            });
          });

          const attendanceRate = totalDays > 0 ? (totalPresent / totalDays) * 100 : 0;
          return { className: cls.name, rate: attendanceRate };
        })
      );

      res.json({
        chartData: attendanceByClass.map((c) => ({ label: c.className, value: c.rate })),
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAttendancePredictions = async (req, res) => {
  const { classId, date } = req.query;

  try {
    let query = {};
    if (classId && classId !== "all-classes") query.classId = classId;
    const selectedDate = parseISO(date || new Date().toISOString());
    const startDate = startOfMonth(subMonths(selectedDate, 3)); // Last 3 months for historical data
    const endDate = endOfMonth(selectedDate);

    const students = await Student.find(query).lean();
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Historical attendance rates
    const historicalRates = days.map((day) => {
      let total = 0;
      let present = 0;
      students.forEach((student) => {
        total++;
        const record = student.attendanceRecords.find(
          (rec) => new Date(rec.date).toDateString() === day.toDateString()
        );
        if (record?.status === "present") present++;
      });
      return total > 0 ? present / total : 0;
    });

    // Simple moving average for prediction (mock AI)
    const futureDays = eachDayOfInterval({
      start: addDays(endDate, 1),
      end: addDays(endDate, 7),
    });
    const predictions = futureDays.map((_, index) => {
      const recentRates = historicalRates.slice(-30); // Last 30 days
      const avgRate = recentRates.reduce((sum, rate) => sum + rate, 0) / recentRates.length;
      // Add some randomness to simulate variation
      const variation = (Math.random() - 0.5) * 0.1;
      return Math.min(Math.max((avgRate + variation) * 100, 0), 100).toFixed(1);
    });

    // Anomaly detection: Flag days with rates > 2 std devs below mean
    const meanRate = historicalRates.reduce((sum, rate) => sum + rate, 0) / historicalRates.length;
    const variance = historicalRates.reduce((sum, rate) => sum + Math.pow(rate - meanRate, 2), 0) / historicalRates.length;
    const stdDev = Math.sqrt(variance);
    const anomalies = historicalRates
      .map((rate, index) => ({
        day: format(days[index], "MMM d"),
        rate: (rate * 100).toFixed(1),
        isAnomaly: rate < meanRate - 2 * stdDev,
      }))
      .filter((item) => item.isAnomaly);

    res.json({
      predictions: futureDays.map((day, index) => ({
        label: format(day, "MMM d"),
        value: parseFloat(predictions[index]),
      })),
      anomalies,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};