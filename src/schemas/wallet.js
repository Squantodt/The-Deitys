const { Schema, model } = require("mongoose");

const walletSchema = new Schema({
  Guild: String,
  User: String,
  Coins: Number,
  Address: String,
});

module.exports = model("wallet", walletSchema);
