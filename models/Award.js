const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema({
  awardId: { type: String, unique: true },
  name: { type: String, required: true },
  description: String,
  criteria: String,
  icon: String,
  studentsAwarded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

awardSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastAward = await mongoose.model("Award").findOne().sort({ awardId: -1 });
    this.awardId = lastAward ? (parseInt(lastAward.awardId) + 1).toString() : "1";
  }
  next();
});

module.exports = mongoose.model("Award", awardSchema);