const { Schema, model } = require("mongoose");

const walletSchema = new Schema({
  Guild: String,
  User: String,
  Coins: Number,
});

module.exports = model("wallet", walletSchema);
