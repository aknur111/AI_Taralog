const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    cardId: { type: String },
    name: { type: String, required: true },
    isReversed: { type: Boolean, default: false },
    position: { type: String, default: "" }
  },
  { _id: false }
);

const readingSchema = new mongoose.Schema(
  
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    spreadType: { type: String, required: true, default: "single" },
    question: { type: String, default: "" },
    cards: { type: [cardSchema], default: [] },
    aiInterpretation: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reading", readingSchema);
