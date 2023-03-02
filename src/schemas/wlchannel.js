const { Schema, model } = require("mongoose");

const wlSchema = new Schema({
  GuildId: String,
  ChannelId: String,
});

module.exports = model("wlChannel", wlSchema);
