const Joi = require("joi");

const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  birthDate: Joi.date().max('now'),
  birthPlace: Joi.string().trim().min(2).max(100),
  birthTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
}).min(1);

module.exports = { updateProfileSchema };
