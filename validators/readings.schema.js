const Joi = require("joi");

const taroReadingSchema = Joi.object({
});

const generalReadingSchema = Joi.object({
  question: Joi.string().required().min(5).max(500)
});

const loveReadingSchema = Joi.object({
  question: Joi.string().required().min(5).max(500),
  partnerData: Joi.object({
    firstName: Joi.string().min(1).max(50),
    lastName: Joi.string().min(1).max(50), 
    birthDate: Joi.date().max('now'),
    birthPlace: Joi.string().min(2).max(100),
    birthTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/) 
  }).optional()
});

const moneyReadingSchema = Joi.object({
  question: Joi.string().required().min(5).max(500)
});

const workReadingSchema = Joi.object({
  question: Joi.string().required().min(5).max(500)
});

module.exports = { 
  taroReadingSchema, 
  generalReadingSchema,
  loveReadingSchema, 
  moneyReadingSchema, 
  workReadingSchema 
};