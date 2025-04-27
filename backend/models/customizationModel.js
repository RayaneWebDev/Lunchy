const mongoose = require("mongoose");

const CustomizationSchema = new mongoose.Schema({
  name: String,
  maxOptions: Number,
  required: Boolean,
  options: [{ name: String, price: Number }],
});

module.exports = mongoose.model("customizations", CustomizationSchema);
