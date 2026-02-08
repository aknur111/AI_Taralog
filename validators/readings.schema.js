const Joi = require("joi");

const cardSchema = Joi.object({
  cardId: Joi.string().required(),
  name: Joi.string().required(),
  isReversed: Joi.boolean().default(false),
  position: Joi.string().allow("")
});

const taroReadingSchema = Joi.object({
  cards: Joi.array().items(cardSchema).length(5).required(),
  language: Joi.string().valid('en', 'ru').default('en')
});

const generalReadingSchema = Joi.object({
  question: Joi.string().required().min(5).max(500),
  language: Joi.string().valid('en', 'ru').default('en')
});

const loveReadingSchema = Joi.object({
  question: Joi.string().required().min(5).max(500),
  language: Joi.string().valid('en', 'ru').default('en'),
  partnerData: Joi.object({
    firstName: Joi.string().min(1).max(50),
    lastName: Joi.string().min(1).max(50), 
    birthDate: Joi.date().max('now'),
    birthPlace: Joi.string().min(2).max(100),
    birthTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/) 
  }).optional()
});

const moneyReadingSchema = Joi.object({
  question: Joi.string().required().min(5).max(500),
  language: Joi.string().valid('en', 'ru').default('en')
});

const workReadingSchema = Joi.object({
  question: Joi.string().required().min(5).max(500),
  language: Joi.string().valid('en', 'ru').default('en')
});

module.exports = { 
  taroReadingSchema, 
  generalReadingSchema,
  loveReadingSchema, 
  moneyReadingSchema, 
  workReadingSchema 
};