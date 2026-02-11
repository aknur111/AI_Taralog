const Joi = require("joi");

const strongPassword = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/)
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be at most 64 characters",
    "string.pattern.base":
      "Password must include: 1 uppercase, 1 lowercase, 1 number, 1 special character",
    "any.required": "Password is required",
  });

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: strongPassword,
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  birthDate: Joi.date().max("now").required(),
  birthPlace: Joi.string().min(2).max(100).required(),
  birthTime: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .allow("")
    .optional(),
  gender: Joi.string().valid("male", "female", "other").required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
