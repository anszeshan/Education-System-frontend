const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  activityLogId: { type: String, unique: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  notes: String,
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

activityLogSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const lastLog = await mongoose.model("ActivityLog").findOne().sort({ activityLogId: -1 });
      if (lastLog && lastLog.activityLogId) {
        const lastId = parseInt(lastLog.activityLogId);
        if (isNaN(lastId)) {
          throw new Error("Invalid activityLogId in database: not a number");
        }
        this.activityLogId = (lastId + 1).toString();
      } else {
        this.activityLogId = "1";
      }
    }
    next();
  } catch (err) {
    console.error("Error in ActivityLog pre-save hook:", err);
    next(err);
  }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);