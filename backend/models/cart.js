const mongoose = require("mongoose");

const cart = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
   
      type: { type: String, enum: ["product", "menu"], required: true },

    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "menu" },

    quantity: { type: Number, required: true, default: 1 },

    customizations: [           
      {
        name: { type: String, required: true },
        selectedOptions: [
          {
            name: { type: String, required: true },
            price: { type: Number, default: 0 },
          },
        ],
      },
    ],

    menuAccompaniments: [
        { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    ],

    totalItemPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cart);
