const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // Stockée sur Cloudinary
    price: { type: Number, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "categoryProduct", required: true },
    customizations: [{ type: mongoose.Schema.Types.ObjectId, ref: "customizations" }], 
    isAvailable: { type: Boolean, default: true }
  }, { timestamps: true });
  
  const product = mongoose.model("product", productSchema);
  module.exports = product;
  