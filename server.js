const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const systemSettingsRoutes = require("./routes/systemSettingsRoutes");
const activityRoutes = require("./routes/activityRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");
const awardRoutes = require("./routes/awardRoutes");
const badgeAwardRoutes = require("./routes/badgeAwardRoutes");
const eventRoutes = require("./routes/eventRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reportRoutes = require("./routes/reportRoutes");
// const importRoutes = require("./routes/importRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "https://attendely-education-system.vercel.app" })); 
app.use(bodyParser.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/system-settings", systemSettingsRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/awards", awardRoutes);
app.use("/api/badge-awards", badgeAwardRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reports", reportRoutes);
// app.use("/api/import", importRoutes);
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
// Error Middleware
app.use(errorMiddleware);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("ERROR",err));






