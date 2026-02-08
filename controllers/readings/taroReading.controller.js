const Reading = require("../../models/Reading");
const Prompt = require("../../models/Prompt");
const User = require("../../models/User");
const grokApiService = require("../../services/grokApi.service");
const contextBuilderService = require("../../services/contextBuilder.server");

exports.createTaroReading = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    const cards = await tarotApiService.getRandomCards(5);

    const systemPrompt = await contextBuilderService.getSystemPrompt("taro");
    const userMessage = await contextBuilderService.buildUserMessage(user, req.body.question, cards);
    
    const interpretation = await grokApiService.getInterpretation(systemPrompt, userMessage);
    
    const reading = await Reading.create({
      user: req.user.id,
      readingType: "taro",
      spreadType: "five_card",
      question: req.body.question || "Taro reading",
      cards: cards,
      additionalData: "No additional data",
      aiInterpretation: interpretation
    });
    
    res.status(201).json(reading);
  } catch (err) {
    next(err);
  }
};