const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Ex: "Sub30 Classique"
    description: { type: String },
    price: { type: Number, required: true },
    category : {type: mongoose.Schema.Types.ObjectId, ref: "categoryProduct",  required: true },
    image: { type: String },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    mainProduct: { type: mongoose.Schema.Types.ObjectId, ref: "product",  required: true }, // Produit principal du menu (ex: Sandwich),
    accompaniments: [
      {
        categories: [{ 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "categoryProduct", 
        }], // Ex: ["Boissons"], ["Desserts", "Chips"]
        required: { type: Boolean, default: false },
        maxChoices: { type: Number, default: 1 }, // Maximum de choix autorisés
      }
    ],
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Menu = mongoose.model("menu", menuSchema);
module.exports = Menu;




