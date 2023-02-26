const { Schema, model } = require("mongoose");

const levelSchema = new Schema({
  Guild: String,
  User: String,
  XP: Number,
  Level: Number,
  LastModified: {
    type: Date,
    default: Date.now(),
  },
});

levelSchema.methods.canEarnXP = function () {
  const now = new Date();
  return now - this.LastModified >= 60000; // 60000ms = 1 minute
};

levelSchema.pre("save", function (next) {
  const now = new Date();
  if (!this.LastModified || this.isModified("XP")) {
    this.LastModified = now;
  }
  next();
});

module.exports = model("level", levelSchema);
