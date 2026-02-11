const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "premium", "admin"], default: "user" },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    birthDate: { type: Date, required: true },
    birthPlace: { type: String, trim: true, required: true },
    birthTime: { type: String, required: false },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
