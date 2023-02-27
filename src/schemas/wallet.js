const { Schema, model } = require("mongoose");

const walletSchema = new Schema({
  Guild: String,
  User: String,
  coins: Number,
});

module.exports = model("wallet", walletSchema);
