const { Schema, model } = require("mongoose");

const xpChannels = new Schema({
  guildId: String,
  channelId: String,
});

module.exports = model("xpChannels", xpChannels);
