const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String }, // URL stockée dans Cloudinary
    address: { type: String, required: true },
    mapImage : {type : String, required : true}, // pour la page contact
    heroImage : {type : String, required : true}, // pour la page menu
    zip_code: { type: String, required: true },
    phone: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "categoryProduct" }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    isActive: { type: Boolean, default: true }           // par exemple si un restaurant est indisponible ou quitte la platforme et qu'on veut laisser l'historique
  }, { timestamps: true });
  
  const Restaurant = mongoose.model("Restaurant", restaurantSchema);
  module.exports = Restaurant;
  