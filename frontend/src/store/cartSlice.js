import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
    
      // Vérifie si c'est un produit simple ou un menu
      const existingItemIndex = state.items.findIndex((item) => {
        if (newItem.type === "menu") {
          // Comparer par menu._id pour un menu
          return item.menu && item.menu._id === newItem.menu._id &&
                 JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations) &&
                 JSON.stringify(item.menuAccompaniments) === JSON.stringify(newItem.menuAccompaniments);
        } else {
          // Comparer par product._id pour un produit simple
          return item.product && item.product._id === newItem.product._id &&
                 JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations) &&
                 JSON.stringify(item.menuAccompaniments) === JSON.stringify(newItem.menuAccompaniments);
        }
      });
    
      if (existingItemIndex !== -1) {
        // Si le produit/menu existe déjà, on met à jour la quantité
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        // Si le produit/menu n'existe pas, on l'ajoute
        state.items.push(newItem);
      }
    },

    removeFromCart: (state, action) => {
      const index = action.payload; // index ou id unique selon ton besoin
      state.items.splice(index, 1);
    },

    updateCartItem: (state, action) => {
      const { index, updatedItem } = action.payload;
      if (state.items[index]) {
        state.items[index] = {
          ...state.items[index],
          ...updatedItem,
        };
      }
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});
export const selectCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => {
    return total + item.totalItemPrice;
  }, 0);
};


export const { addToCart, removeFromCart, updateCartItem, clearCart, setCart } = cartSlice.actions;

export default cartSlice.reducer;
