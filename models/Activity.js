const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  activityId: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, enum: ["academic", "creative", "physical"], required: true },
  eligibleClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  assignedGuides: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

activitySchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastActivity = await mongoose.model("Activity").findOne().sort({ activityId: -1 });
    this.activityId = lastActivity ? (parseInt(lastActivity.activityId) + 1).toString() : "1";
  }
  next();
});

module.exports = mongoose.model("Activity", activitySchema);