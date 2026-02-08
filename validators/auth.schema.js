const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  birthDate: Joi.date().max('now').required(),
  birthPlace: Joi.string().min(2).max(100).required(),
  birthTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow('').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };