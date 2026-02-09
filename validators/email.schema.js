const Joi = require("joi");

const testEmailSchema = Joi.object({
  to: Joi.string().email().required(),
  firstName: Joi.string().allow("").max(60).optional(),
});

module.exports = { testEmailSchema };
