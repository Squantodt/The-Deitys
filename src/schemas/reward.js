const { Schema, model } = require("mongoose");

const rewardSchema = new Schema({
  GuildId: String,
  Time: String,
  Amount: Number,
  Role: String,
});

module.exports = model("Reward", rewardSchema, "rewards");
