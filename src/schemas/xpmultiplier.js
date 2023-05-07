const { Schema, model } = require("mongoose");

const multiplierSchema = new Schema({
  Role: Number,
  Multiplier: Number,
});

module.exports = model("xpmultiplier", multiplierSchema);
