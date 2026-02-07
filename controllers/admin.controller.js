const Reading = require("../models/Reading");

exports.getAllReadings = async (req, res, next) => {
  try {
    const readings = await Reading.find().sort({ createdAt: -1 });
    res.json(readings);
  } catch (e) {
    next(e);
  }
};

exports.deleteAnyReading = async (req, res, next) => {
  try {
    const reading = await Reading.findById(req.params.id);
    if (!reading) return res.status(404).json({ message: "Reading not found" });

    await reading.deleteOne();
    res.json({ message: "Deleted by admin" });
  } catch (e) {
    next(e);
  }
};
