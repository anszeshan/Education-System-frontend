const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  date: { type: Date, required: true },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionNotes: String,
});

sessionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastSession = await mongoose.model("Session").findOne().sort({ sessionId: -1 });
    this.sessionId = lastSession ? (parseInt(lastSession.sessionId) + 1).toString() : "1";
  }
  next();
});

module.exports = mongoose.model("Session", sessionSchema);