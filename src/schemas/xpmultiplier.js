const { Schema, model } = require("mongoose");

const multiplierSchema = new Schema({
  Role: String,
  Multiplier: Number,
  GuildId: String,
});

module.exports = model("xpmultiplier", multiplierSchema);
