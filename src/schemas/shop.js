const { Schema, model } = require("mongoose");

const storeSchema = new Schema({
  Guild: String,
  Name: String,
  Cat: String,
  Price: Number,
  Amount: Number,
  Tokens: Number,
});

module.exports = model("shop", storeSchema);
