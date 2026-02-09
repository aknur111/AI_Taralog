const mongoose = require("mongoose");

const EmailLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: String, required: true },
    type: { type: String, required: true },
    provider: { type: String, default: "sendgrid" },
    status: { type: String, enum: ["sent", "failed"], required: true },
    error: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailLog", EmailLogSchema);
