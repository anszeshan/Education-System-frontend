const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
  const { startDate, endDate, classId, activity } = req.query;

  try {
    let query = {};
    
    // If the user is not an admin, filter events by their userId (guides)
    // if (req.user.role !== "admin") {
    //   query.guides = req.user.userId;
    // }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (classId) query.classes = classId;
    if (activity) query.title = { $regex: activity, $options: "i" };

    const events = await Event.find(query)
      .populate("classes", "name")
      .populate("guides", "name")
      .lean();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEvent = async (req, res) => {
  const { title, date, startTime, endTime, location, description, classes, guides } = req.body;

  // Basic validation
  if (!title || !date) {
    return res.status(400).json({ message: "Title and date are required" });
  }

  try {
    const event = new Event({ 
      title, 
      date: new Date(date), 
      startTime, 
      endTime, 
      location, 
      description, 
      classes: classes || [], 
      guides: guides || [] 
    });
    await event.save();
    const populatedEvent = await Event.findOne({ eventId: event.eventId })
      .populate("classes", "name")
      .populate("guides", "name")
      .lean();
    res.status(201).json(populatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};