const { Schema, model } = require("mongoose");

const claimSchema = new Schema({
  GuildId: String,
  Timeframe: String,
  User: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Claim", claimSchema, "claims");
