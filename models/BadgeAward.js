const mongoose = require("mongoose");

const badgeAwardSchema = new mongoose.Schema({
  badgeAwardId: { type: Number, unique: true },
  badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Award", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
  note: String,
});

badgeAwardSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastBadgeAward = await mongoose.model("BadgeAward").findOne().sort({ badgeAwardId: -1 });
    this.badgeAwardId = lastBadgeAward ? lastBadgeAward.badgeAwardId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("BadgeAward", badgeAwardSchema);