const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const SystemSettings = require("./models/SystemSettings");
const Activity = require("./models/Activity");
const ActivityLog = require("./models/ActivityLog");
const Class = require("./models/Class");
const Student = require("./models/Student");
const Award = require("./models/Award");
const BadgeAward = require("./models/BadgeAward");
const Event = require("./models/Event");
const Session = require("./models/Session");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Drop the database
    // Create Admin
    const admin = new User({
      name: "Admin User",
      email: "admin@1234444.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
      phone: "123-456-7890",
      bio: "School Administrator",
      avatar: "admin.jpg",
      notificationSettings: {
        emailNotifications: true,
        activitySummary: true,
        attendanceAlerts: true,
        systemUpdates: false,
      },
      securitySettings: {
        twoFactorAuth: true,
        sessionTimeout: 60,
        passwordExpiry: "90",
      },
    });
    await admin.save();
    console.log("Admin created:", admin.email);

    // Create Guides
    const guide1 = new User({
      name: "Guide One",
      email: "guide1@gafen111.com",
      password: await bcrypt.hash("guide123", 10),
      role: "guide",
      phone: "234-567-8901",
      bio: "Math and Science Guide",
      avatar: "guide1.jpg",
      subjects: ["Math", "Science"],
      yearsOfExperience: "5",
      notificationSettings: {
        emailNotifications: true,
        activityReminders: true,
        attendanceAlerts: true,
        systemUpdates: true,
      },
    });

    const guide2 = new User({
      name: "Guide Two",
      email: "guide2@gafen2222.com",
      password: await bcrypt.hash("guide123", 10),
      role: "guide",
      phone: "345-678-9012",
      bio: "English and Arts Guide",
      avatar: "guide2.jpg",
      subjects: ["English", "Arts"],
      yearsOfExperience: "3",
      notificationSettings: {
        emailNotifications: true,
        activityReminders: true,
        attendanceAlerts: false,
        systemUpdates: false,
      },
    });

    await guide1.save();
    await guide2.save();
    console.log("Guides created:", guide1.email, guide2.email);

    // Create System Settings
    const systemSettings = new SystemSettings({
      adminId: admin.userId,
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      academicYear: "2024-2025",
    });
    await systemSettings.save();
    console.log("System settings created for admin:", admin.userId);

    // Create Classes
    const class1 = new Class({
      name: "Class 5A",
      assignedGuides: [guide1.userId],
      totalStudents: 0,
    });

    const class2 = new Class({
      name: "Class 5B",
      assignedGuides: [guide2.userId],
      totalStudents: 0,
    });

    const class3 = new Class({
      name: "Class 6A",
      assignedGuides: [guide1.userId, guide2.userId],
      totalStudents: 0,
    });

    await class1.save();
    await class2.save();
    await class3.save();
    console.log("Classes created:", class1.name, class2.name, class3.name);

    // Create Students
    const students = [
      { name: "Alice Smith", classId: class1.classId, notes: "Good at math" },
      { name: "Bob Johnson", classId: class1.classId, notes: "Needs help with reading" },
      { name: "Charlie Brown", classId: class2.classId, notes: "Very active" },
      { name: "Diana Prince", classId: class2.classId, notes: "Loves art" },
      { name: "Eve Adams", classId: class3.classId, notes: "Quiet but attentive" },
    ];

    const savedStudents = await Promise.all(
      students.map(async (studentData) => {
        const student = new Student(studentData);
        await student.save();

        // Update the class's students array and totalStudents
        await Class.findOneAndUpdate(
          { classId: studentData.classId },
          { $push: { students: student.studentId }, $inc: { totalStudents: 1 } }
        );

        return student;
      })
    );
    console.log("Students created:", savedStudents.map((s) => s.name));

    // Create Activities
    const activities = [
      {
        name: "Math Workshop",
        description: "Weekly math problem-solving session",
        category: "academic",
        eligibleClasses: [class1.classId, class3.classId],
        assignedGuides: [guide1.userId],
      },
      {
        name: "Art Class",
        description: "Painting and drawing session",
        category: "creative",
        eligibleClasses: [class2.classId, class3.classId],
        assignedGuides: [guide2.userId],
      },
      {
        name: "Sports Day",
        description: "Outdoor sports activities",
        category: "physical",
        eligibleClasses: [class1.classId, class2.classId, class3.classId],
        assignedGuides: [guide1.userId, guide2.userId],
      },
    ];

    const savedActivities = await Activity.insertMany(activities);
    console.log("Activities created:", savedActivities.map((a) => a.name));

    // Update Classes with Activities
    await Class.findOneAndUpdate(
      { classId: class1.classId },
      { activities: [savedActivities[0].activityId, savedActivities[2].activityId] }
    );
    await Class.findOneAndUpdate(
      { classId: class2.classId },
      { activities: [savedActivities[1].activityId, savedActivities[2].activityId] }
    );
    await Class.findOneAndUpdate(
      { classId: class3.classId },
      { activities: [savedActivities[0].activityId, savedActivities[1].activityId, savedActivities[2].activityId] }
    );

    // Create Activity Logs
    const activityLogs = [
      {
        activityId: savedActivities[0].activityId,
        classId: class1.classId,
        guideId: guide1.userId,
        topic: "Algebra Basics",
        description: "Introduction to algebraic expressions",
        notes: "Students were engaged",
        date: new Date("2025-04-01"),
        startTime: "10:00",
        endTime: "11:00",
      },
      {
        activityId: savedActivities[1].activityId,
        classId: class2.classId,
        guideId: guide2.userId,
        topic: "Watercolor Painting",
        description: "Learning watercolor techniques",
        notes: "Good participation",
        date: new Date("2025-04-02"),
        startTime: "14:00",
        endTime: "15:30",
      },
    ];

    const savedActivityLogs = await ActivityLog.insertMany(activityLogs);
    console.log("Activity logs created:", savedActivityLogs.map((log) => log.topic));

    // Create Awards
    const awards = [
      {
        name: "Perfect Attendance",
        description: "Awarded for perfect attendance in a month",
        criteria: "No absences in 30 days",
        icon: "🏆",
      },
      {
        name: "Math Wizard",
        description: "Awarded for excellence in math",
        criteria: "Top score in math quiz",
        icon: "🧙‍♂️",
      },
      {
        name: "Art Star",
        description: "Awarded for outstanding artwork",
        criteria: "Best artwork in class",
        icon: "🎨",
      },
    ];

    const savedAwards = await Award.insertMany(awards);
    console.log("Awards created:", savedAwards.map((a) => a.name));

    // Create Badge Awards
    const badgeAwards = [
      {
        badgeId: savedAwards[0].awardId,
        studentId: savedStudents[0].studentId, // Alice gets Perfect Attendance
        guideId: guide1.userId,
        date: new Date("2025-04-03"),
        note: "No absences in April",
      },
      {
        badgeId: savedAwards[1].awardId,
        studentId: savedStudents[1].studentId, // Bob gets Math Wizard
        guideId: guide1.userId,
        date: new Date("2025-04-04"),
        note: "Top score in algebra quiz",
      },
    ];

    const savedBadgeAwards = await BadgeAward.insertMany(badgeAwards);

    // Update Award and Student with badge awards
    await Award.findOneAndUpdate(
      { awardId: savedAwards[0].awardId },
      { $push: { studentsAwarded: savedStudents[0].studentId } }
    );
    await Award.findOneAndUpdate(
      { awardId: savedAwards[1].awardId },
      { $push: { studentsAwarded: savedStudents[1].studentId } }
    );
    await Student.findOneAndUpdate(
      { studentId: savedStudents[0].studentId },
      { $push: { awards: savedAwards[0].awardId } }
    );
    await Student.findOneAndUpdate(
      { studentId: savedStudents[1].studentId },
      { $push: { awards: savedAwards[1].awardId } }
    );
    console.log("Badge awards created:", savedBadgeAwards.map((ba) => ba.note));

    // Create Events
    const events = [
      {
        title: "Parent-Teacher Meeting",
        date: new Date("2025-05-10"),
        startTime: "09:00",
        endTime: "12:00",
        location: "School Hall",
        description: "Discuss student progress",
        classes: [class1.classId, class2.classId],
        guides: [guide1.userId, guide2.userId],
      },
      {
        title: "Science Fair",
        date: new Date("2025-05-15"),
        startTime: "10:00",
        endTime: "14:00",
        location: "Science Lab",
        description: "Student project presentations",
        classes: [class1.classId, class3.classId],
        guides: [guide1.userId],
      },
      {
        title: "Art Exhibition",
        date: new Date("2025-05-20"),
        startTime: "13:00",
        endTime: "16:00",
        location: "Art Room",
        description: "Showcase student artwork",
        classes: [class2.classId, class3.classId],
        guides: [guide2.userId],
      },
    ];

    const savedEvents = await Event.insertMany(events);
    console.log("Events created:", savedEvents.map((e) => e.title));

    // Create Sessions (Attendance)
    const sessions = [
      {
        classId: class1.classId,
        date: new Date("2025-04-01"),
        guideId: guide1.userId,
        sessionNotes: "Math workshop attendance",
      },
      {
        classId: class2.classId,
        date: new Date("2025-04-02"),
        guideId: guide2.userId,
        sessionNotes: "Art class attendance",
      },
    ];

    const savedSessions = await Session.insertMany(sessions);

    // Update Student Attendance Records
    await Student.findOneAndUpdate(
      { studentId: savedStudents[0].studentId },
      {
        $push: {
          attendanceRecords: {
            date: new Date("2025-04-01"),
            status: "present",
            notes: "Attended math workshop",
          },
        },
      }
    );
    await Student.findOneAndUpdate(
      { studentId: savedStudents[1].studentId },
      {
        $push: {
          attendanceRecords: {
            date: new Date("2025-04-01"),
            status: "absent",
            notes: "Sick",
          },
        },
      }
    );
    await Student.findOneAndUpdate(
      { studentId: savedStudents[2].studentId },
      {
        $push: {
          attendanceRecords: {
            date: new Date("2025-04-02"),
            status: "present",
            notes: "Attended art class",
          },
        },
      }
    );
    await Student.findOneAndUpdate(
      { studentId: savedStudents[3].studentId },
      {
        $push: {
          attendanceRecords: {
            date: new Date("2025-04-02"),
            status: "present",
            notes: "Very engaged",
          },
        },
      }
    );
    console.log("Sessions created:", savedSessions.map((s) => s.sessionNotes));

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
connectDB().then(() => seedData());