const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  attendanceRecords: [
    {
      date: Date,
      status: { type: String, enum: ["present", "absent"] },
      notes: String,
    },
  ],
  awards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Award" }],
  notes: String,
});

studentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastStudent = await mongoose.model("Student").findOne().sort({ studentId: -1 });
    this.studentId = lastStudent ? (parseInt(lastStudent.studentId) + 1).toString() : "1";
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);