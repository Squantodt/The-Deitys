const { Schema, model } = require("mongoose");

const wlSchema = new Schema({
  Guild: String,
  User: String,
  ItemId: Number,
  Address: String,
});

wlSchema.methods.canEarnXP = function () {
  const now = new Date();
  return now - this.LastModified >= 60000; // 60000ms = 1 minute
};

wlSchema.pre("save", function (next) {
  const now = new Date();
  if (!this.LastModified || this.isModified("XP")) {
    this.LastModified = now;
  }
  next();
});

module.exports = model("whiteLists", wlSchema);
