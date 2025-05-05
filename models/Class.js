const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  classId: { type: String, unique: true },
  name: { type: String, required: true },
  totalStudents: { type: Number, default: 0 },
  assignedGuides: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

classSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastClass = await mongoose.model("Class").findOne().sort({ classId: -1 });
    this.classId = lastClass ? (parseInt(lastClass.classId) + 1).toString() : "1";
  }
  next();
});

module.exports = mongoose.model("Class", classSchema);