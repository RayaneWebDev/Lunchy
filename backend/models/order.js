const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  address: { type: String, required: true },
  zip_code: { type: String, required: true },
  dateLivraison: { type: Date, required: true },

  items: [
    {
      type: { type: String, enum: ["product", "menu"], required: true },

      product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      customizations: [
        {
          name: { type: String, required: true },
          selectedOptions: [
            {
              name: { type: String, required: true },
              price: { type: Number, default: 0 }
            }
          ]
        }
      ],

      menu: { type: mongoose.Schema.Types.ObjectId, ref: "menu" },
      menuAccompaniments: [
           { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true }
      ],

      quantity: { type: Number, default: 1, min: 1 },
      totalItemPrice: { type: Number, required: true }
    }
  ],

  totalPrice: { type: Number, required: true },

  status: {
    type: String,
    enum: ["confirmé", "annulée"],
    default: "confirmé"
  },
  orderNumber: {
  type: String,
  unique: true,
  required: true
  },


  paymentStatus: {
    type: String,
    enum: ["impayé", "payé", "échoué"],
    default: "impayé"
  },

  deliveryFee : {type : Number , required : true} ,
  event: {
    type: String,
    default: null
  }

}, { timestamps: true });




const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
