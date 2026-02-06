const Joi = require("joi");

const createReadingSchema = Joi.object({
  spreadType: Joi.string().min(1).required(),
  question: Joi.string().allow("").optional()
});

const updateReadingSchema = Joi.object({
  spreadType: Joi.string().min(1).optional(),
  question: Joi.string().allow("").optional(),
  aiInterpretation: Joi.string().allow("").optional()
}).min(1);

module.exports = { createReadingSchema, updateReadingSchema };
