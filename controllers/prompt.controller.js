const Prompt = require('../models/Prompt');

exports.createPrompt = async (req, res, next) => {
  try {
    const { name, content } = req.body;
    const prompt = await Prompt.create({ name, content });
    res.status(201).json(prompt);
  } catch (err) {
    next(err);
  }
};

exports.getPrompts = async (req, res, next) => {
  try {
    const prompts = await Prompt.find();
    res.json(prompts);
  } catch (err) {
    next(err);
  }
};

exports.getPromptById = async (req, res, next) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) return res.status(404).json({ message: "Prompt not found" });
        res.json(prompt);
    } catch (err) {
        next(err);
    }
};

exports.updatePrompt = async (req, res, next) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) return res.status(404).json({ message: "Prompt not found" });
        const { name, content } = req.body;
        prompt.name = name;
        prompt.content = content;
        await prompt.save();
        res.json(prompt);
    } catch (err) {
        next(err);
    }
};

exports.deletePrompt = async (req, res, next) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) return res.status(404).json({ message: "Prompt not found" });
        await prompt.deleteOne();
        res.json({ message: "Prompt deleted successfully" });
    } catch (err) {
        next(err);
    }
};