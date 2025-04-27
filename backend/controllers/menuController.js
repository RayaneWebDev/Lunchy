const Menu = require("../models/menu")
const Restaurant = require("../models/Restaurant")


exports.createMenu = async (req, res) => {
  try {
    const menu = new Menu(req.body);
    const {restaurant} = req.body;
    const restaurantExists = await Restaurant.findById(restaurant)
    if (!restaurantExists) {
        return res.status(404).json({ message: "Restaurant introuvable", success: false, error : true });
    }
    await menu.save();
    restaurantExists.products.push(menu._id)
    await restaurantExists.save()
    res.status(201).json({ success: true, message: "Menu ajouté avec succès",error : false, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, error : true , message: "Erreur lors de l'ajout du menu" });
  }
};

exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find()
      .populate("restaurant")
      .populate("mainProduct")
      .populate("category")
      .populate("accompaniments.categories");

    res.status(200).json({ success: true, error : false , data: menus });
  } catch (error) {
    res.status(500).json({ success: false, error : true, message: "Erreur lors de la récupération des menus", error: error.message });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate("restaurant")
      .populate("mainProduct")
      .populate("category")
      .populate("accompaniments.categories");

    if (!menu) {
      return res.status(404).json({ success: false, error : true, message: "Menu non trouvé" });
    }

    res.status(200).json({ success: true, error : false , data: menu });
  } catch (error) {
    res.status(500).json({ success: false, error : true, message: "Erreur lors de la récupération du menu", error: error.message });
  }
};

exports.getMenusByRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const menus = await Menu.find({ restaurant: id }).populate("restaurant").populate("mainProduct").populate("category").populate("accompaniments.categories");

        return res.status(200).json({ success: true, error : false, data : menus });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Erreur serveur", success: false , error : true });
    }
};


exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!menu) {
      return res.status(404).json({ success: false, error : true, message: "Menu non trouvé" });
    }

    res.status(200).json({ success: true, error : false, message: "Menu mis à jour avec succès", data: menu });
  } catch (error) {
    res.status(500).json({ success: false, error : true, message: "Erreur lors de la mise à jour du menu", error: error.message });
  }
};


exports.deleteMenu = async (req, res) => {
    try {
      const menu = await Menu.findByIdAndDelete(req.params.id);
  
      if (!menu) {
        return res.status(404).json({ success: false, error: true, message: "Menu non trouvé" });
      }
  
      // Retirer le menu de la liste des produits du restaurant
      await Restaurant.updateMany({}, { $pull: { products: req.params.id } });
  
      res.status(200).json({ success: true, error: false, message: "Menu supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ success: false, error: true, message: "Erreur lors de la suppression du menu", errorDetails: error.message });
    }
  };
  

exports.getMenusByCategory = async (req, res) => {
      try {
          const { restaurantId, categoryId } = req.params;
  
          // Récupérer les produits associés à un restaurant et à une catégorie spécifique
          const menus = await Menu.find({ 
              restaurant: restaurantId, 
              category: categoryId 
          }).populate("category");
  
          if (menus.length === 0) {
              return res.status(404).json({ message: "Aucun menu trouvé pour cette catégorie", success: false, error : true });
          }
  
          return res.status(200).json({ success: true, error : false, data : menus });
      } catch (error) {
          return res.status(500).json({ message: "Erreur serveur", success: false, error : true });
      }
  };