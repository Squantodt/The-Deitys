const { Schema, model } = require("mongoose");

const unhandledSchema = new Schema({
  Guild: String,
  User: String,
  ItemId: String,
});

module.exports = model("unhandled", unhandledSchema);
