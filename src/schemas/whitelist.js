const { Schema, model } = require("mongoose");

const wlSchema = new Schema({
  Guild: String,
  User: String,
  ItemId: String,
});

module.exports = model("whitelists", wlSchema);
