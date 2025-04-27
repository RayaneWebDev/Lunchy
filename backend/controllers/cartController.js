const CartProduct = require("../models/cart");
const Product = require("../models/product");
const Menu = require("../models/menu");


module.exports = {
  addToCart: async (req, res) => {
    try {
      const { type, product, menu, quantity, customizations = [], menuAccompaniments = [] , totalItemPrice} = req.body;


      const newCartItem = new CartProduct({
        user: req.userId,
        type,
        product,
        menu,
        quantity,
        customizations,
        menuAccompaniments,
        totalItemPrice,
      });

      await newCartItem.save();
      res.status(201).json({ success: true, error: false, data: newCartItem, message: "Ajouté au panier" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: true, message: "Erreur dans ajout au panier" });
    }
  },

  getUserCart: async (req, res) => {
    try {
      const userId = req.userId;
      const cart = await CartProduct.find({ user: userId })
      .populate({
        path: "product",
        populate: { path: "category" },
      })
      .populate({
        path: "menu",
        populate: [
          { path: "category" },
          { path: "mainProduct"},
          {
            path: "accompaniments.categories",
          },
        ],
      })
      .populate({
        path: "menuAccompaniments",
        populate: { path: "category" },
      });
      res.status(200).json({ success: true, error: false, data: cart });
    } catch (err) {
      res.status(500).json({ success: false, error: true, message: "Erreur dans get cart" });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { itemId } = req.params;
      await CartProduct.findByIdAndDelete(itemId);
      res.status(200).json({ success: true, error: false, message: "Item supprimé du panier" });
    } catch (err) {
      res.status(500).json({ success: false, error: true, message: "Erreur dans suppression du produit" });
    }
  },

  updateQuantityCart: async (req, res) => {
    try {
      const cartItemId = req.params.itemId;
      const { quantity, totalItemPrice } = req.body;
  
      const updatedCart = await CartProduct.findByIdAndUpdate(
        cartItemId,
        { $set: { quantity, totalItemPrice } },
        { new: true }
      );
  
      if (!updatedCart) {
        return res.status(404).json({ success: false, message: "Article non trouvé" });
      }
  
      res.status(200).json({ success: true, message: "Quantité mise à jour", data: updatedCart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Erreur lors de la mise à jour" });
    }
  }
  ,

  deleteCart: async (req, res) => {
    try {
      const userId = req.userId;
      await CartProduct.deleteMany({ user: userId });
      res.status(200).json({ success: true, error: false, message: "Panier vidé avec succès" });
    } catch (err) {
      res.status(500).json({ success: false, error: true, message: "Erreur dans clear cart" });
    }
  }
};
