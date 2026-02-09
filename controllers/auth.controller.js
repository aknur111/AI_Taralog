const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendWelcomeEmail } = require("../services/email.service");
const { registerSchema, loginSchema } = require("../validators/auth.schema");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    birthPlace: user.birthPlace,
    birthTime: user.birthTime,
  };
}

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    const email = value.email.toLowerCase();

    const exists = await User.findOne({
      $or: [{ email }, { username: value.username }],
    });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(value.password, 10);

    const user = await User.create({
      ...value,
      email,
      password: hash,
    });

    sendWelcomeEmail({ to: user.email, firstName: user.firstName }).catch(
      (e) => console.log("EMAIL_FAILED", e?.message || e)
    );

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    const email = value.email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(value.password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    return res.json({
      token,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};
