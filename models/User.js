const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "premium", "admin"], default: "user" },
    firstName: { type: String, trim: true , required: false},
    lastName: { type: String, trim: true, required: false },
    birthDate: { type: Date, required: false },
    birthPlace: { type: String, trim: true, required: false },
    birthTime: { type: String , required: false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
