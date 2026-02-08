
const Reading = require("../../models/Reading");
const Prompt = require("../../models/Prompt");
const User = require("../../models/User");
const grokApiService = require("../../services/grokApi.service");
const contextBuilderService = require("../../services/contextBuilder.server");


exports.createLoveReading = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
                
        const systemPrompt = await contextBuilderService.getSystemPrompt("love");
        const userMessage = await contextBuilderService.buildUserMessage(user, req.body.question, cards);
        
        const interpretation = await grokApiService.getInterpretation(systemPrompt, userMessage);
        
        const reading = await Reading.create({
            user: req.user.id, 
            readingType: "love",
            spreadType: "question",
            question: req.body.question || "Love reading",
            additionalData: req.body.additionalData || "No data about user's love",
            aiInterpretation: interpretation
        });
        
        res.status(201).json(reading);
    } catch (err) {
        next(err);
    }
};