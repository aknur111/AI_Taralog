const Reading = require("../../models/Reading");
const User = require("../../models/User");
const grokApiService = require("../../services/grokApi.service");
const contextBuilderService = require("../../services/contextBuilder.service");

exports.createWorkReading = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { question, language = 'en' } = req.body;
    
    const systemPrompt = await contextBuilderService.getSystemPrompt("work");
    const userMessage = contextBuilderService.buildUserMessage(user, question, [], null, language);
    
    const interpretation = await grokApiService.getInterpretation(systemPrompt, userMessage);
    
    const reading = await Reading.create({
      user: req.user.id, 
      readingType: "work",
      spreadType: "question",
      question: question,
      aiInterpretation: interpretation
    });
    
    res.status(201).json(reading);
  } catch (err) {
    next(err);
  }
};