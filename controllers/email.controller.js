const { sendWelcomeEmail } = require("../services/email.service");
const { testEmailSchema } = require("../validators/email.schema");

exports.sendTestEmail = async (req, res, next) => {
  try {
    const payload = await testEmailSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await sendWelcomeEmail({
      to: payload.to,
      firstName: payload.firstName,
    });

    res.json({ message: "Email sent", result });
  } catch (err) {
    if (err && err.isJoi) {
      return res.status(400).json({
        message: "Validation error",
        details: err.details.map((d) => d.message),
      });
    }
    next(err);
  }
};
