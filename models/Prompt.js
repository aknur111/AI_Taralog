const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    content: { type: String, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prompt", promptSchema);