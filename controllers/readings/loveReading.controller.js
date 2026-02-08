const Reading = require("../../models/Reading");
const User = require("../../models/User");
const grokApiService = require("../../services/grokApi.service");
const contextBuilderService = require("../../services/contextBuilder.service");

exports.createLoveReading = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { question, partnerData, language = 'en' } = req.body;
            
    const systemPrompt = await contextBuilderService.getSystemPrompt("love");
    const userMessage = contextBuilderService.buildUserMessage(user, question, [], partnerData, language);
    
    const interpretation = await grokApiService.getInterpretation(systemPrompt, userMessage);
    
    const reading = await Reading.create({
      user: req.user.id, 
      readingType: "love",
      spreadType: "question",
      question: question,
      additionalData: partnerData || {},
      aiInterpretation: interpretation
    });
    
    res.status(201).json(reading);
  } catch (err) {
    next(err);
  }
};