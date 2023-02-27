const { Schema, model } = require("mongoose");

const shopSchema = new Schema({
  Guild: String,
  type: String,
  price: Number,
  Level: Number,
  amount: Number,
});

shopSchema.methods.canBuy = function () {
  return this.amount > 0;
};

shopSchema.pre("save", function (next) {
  const now = new Date();
  if (!canBuy) {
    return;
  }
  next();
});

module.exports = model("shop", shopSchema);
