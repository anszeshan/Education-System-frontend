const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventId: { type: String, unique: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: String,
  endTime: String,
  location: String,
  description: String,
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  guides: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

eventSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastEvent = await mongoose.model("Event").findOne().sort({ eventId: -1 });
    this.eventId = lastEvent ? (parseInt(lastEvent.eventId) + 1).toString() : "1";
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);