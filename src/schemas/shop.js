const { Schema, model } = require("mongoose");

const storeSchema = new Schema({
  Guild: String,
  type: String,
  price: Number,
  Level: Number,
  amount: Number,
});

storeSchema.pre("save", function (next) {
  const now = new Date();
  if (!canBuy) {
    return;
  }
  next();
});

module.exports = model("shop", storeSchema);
