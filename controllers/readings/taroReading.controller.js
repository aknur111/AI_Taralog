const Reading = require("../../models/Reading");
const User = require("../../models/User");
const grokApiService = require("../../services/grokApi.service");
const contextBuilderService = require("../../services/contextBuilder.service");

exports.createTaroReading = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { cards, language = 'en' } = req.body;
    
    if (!cards || cards.length !== 5) {
      return res.status(400).json({ message: "Exactly 5 cards required" });
    }

    const systemPrompt = await contextBuilderService.getSystemPrompt("taro");
    const userMessage = contextBuilderService.buildUserMessage(user, null, cards, null, language);
    
    const interpretation = await grokApiService.getInterpretation(systemPrompt, userMessage);
    
    const reading = await Reading.create({
      user: req.user.id,
      readingType: "taro",
      spreadType: "five_card",
      question: "",
      cards: cards,
      aiInterpretation: interpretation
    });
    
    res.status(201).json(reading);
  } catch (err) {
    next(err);
  }
};