const Joi = require("joi");

const cardSchema = Joi.object({
  cardId: Joi.string().required(),
  name: Joi.string().required(),
  isReversed: Joi.boolean().default(false),
  position: Joi.string().allow("").default(""),
});

const partnerDataSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  birthDate: Joi.date().max("now").optional(),
  birthPlace: Joi.string().min(2).max(100).optional(),
  birthTime: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
}).optional();

const base = Joi.object({
  spreadType: Joi.string().min(1).required(),
  language: Joi.string().valid("en", "ru").default("en"),
  readingType: Joi.string().valid("taro", "general", "love", "money", "work").required(),
});

const taro = base.keys({
  readingType: Joi.string().valid("taro").required(),
  cards: Joi.array().items(cardSchema).length(5).required(),
  question: Joi.string().allow("").optional(),
});

const general = base.keys({
  readingType: Joi.string().valid("general").required(),
  question: Joi.string().min(5).max(500).required(),
});

const love = base.keys({
  readingType: Joi.string().valid("love").required(),
  question: Joi.string().min(5).max(500).required(),
  partnerData: partnerDataSchema,
});

const money = base.keys({
  readingType: Joi.string().valid("money").required(),
  question: Joi.string().min(5).max(500).required(),
});

const work = base.keys({
  readingType: Joi.string().valid("work").required(),
  question: Joi.string().min(5).max(500).required(),
});

const createReadingSchema = Joi.alternatives().try(taro, general, love, money, work);

const updateReadingSchema = Joi.object({
  spreadType: Joi.string().min(1).optional(),
  language: Joi.string().valid("en", "ru").optional(),
  readingType: Joi.string().valid("taro", "general", "love", "money", "work").optional(),
  question: Joi.string().allow("").optional(),
  cards: Joi.array().items(cardSchema).optional(),
  partnerData: partnerDataSchema,
  aiInterpretation: Joi.string().allow("").optional(),
}).min(1);

module.exports = { createReadingSchema, updateReadingSchema };
