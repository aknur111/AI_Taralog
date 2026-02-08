const Joi = require("joi");

const createPromptSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(100),
  content: Joi.string().required().min(10)
});

const updatePromptSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  content: Joi.string().min(10)
});

module.exports = { createPromptSchema, updatePromptSchema };