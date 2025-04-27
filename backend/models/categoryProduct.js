const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    typeCategory : {
      type: String,
        enum: ["Elémentaire", "Menu", "Accompagnement"],
        default: "Elémentaire"
    },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true }
  });
  
  const categoryProduct = mongoose.model("categoryProduct", categorySchema);
  module.exports = categoryProduct;
  