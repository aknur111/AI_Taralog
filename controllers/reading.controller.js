const Reading = require("../models/Reading");

exports.createReading = async (req, res, next) => {
  try {
    const { spreadType, question, readingType, language, cards, partnerData } = req.body;

    const reading = await Reading.create({
      user: req.user.id,
      spreadType,
      question: question || "",
      cards: Array.isArray(cards) ? cards : [],
      aiInterpretation: "",
      readingType,
      additionalData: {
        ...(language ? { language } : {}),
        ...(partnerData ? { partnerData } : {})
      }
    });

    res.status(201).json(reading);
  } catch (err) {
    next(err);
  }
};

exports.getMyReadings = async (req, res, next) => {
  try {
    const readings = await Reading.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(readings);
  } catch (err) {
    next(err);
  }
};

exports.getReadingById = async (req, res, next) => {
  try {
    const reading = await Reading.findById(req.params.id);
    if (!reading) return res.status(404).json({ message: "Reading not found" });

    if (reading.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(reading);
  } catch (err) {
    next(err);
  }
};

exports.updateReading = async (req, res, next) => {
  try {
    const reading = await Reading.findById(req.params.id);
    if (!reading) return res.status(404).json({ message: "Reading not found" });

    if (reading.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { spreadType, question, aiInterpretation, readingType, cards, language, partnerData } = req.body;

    if (spreadType !== undefined) reading.spreadType = spreadType;
    if (question !== undefined) reading.question = question;
    if (aiInterpretation !== undefined) reading.aiInterpretation = aiInterpretation;
    if (readingType !== undefined) reading.readingType = readingType;
    if (cards !== undefined) reading.cards = cards;

    if (language !== undefined || partnerData !== undefined) {
      reading.additionalData = {
        ...(reading.additionalData || {}),
        ...(language !== undefined ? { language } : {}),
        ...(partnerData !== undefined ? { partnerData } : {})
      };
    }

    await reading.save();
    res.json(reading);
  } catch (err) {
    next(err);
  }
};

exports.deleteReading = async (req, res, next) => {
  try {
    const reading = await Reading.findById(req.params.id);
    if (!reading) return res.status(404).json({ message: "Reading not found" });

    if (reading.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await reading.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
