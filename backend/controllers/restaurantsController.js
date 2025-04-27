const Restaurant = require('../models/Restaurant');

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ 
        message : "Liste des restaurants récupéree avec succès",
        success : true,
        error : false,
        data : restaurants
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Erreur dans get des restaurants',
        success : false,
        error : true
    });
  }
};

const getRestaurant = async (req, res) => {
  try {
      const { restaurantId } = req.params;
      const restaurant = await Restaurant.findById(restaurantId).populate("categories").populate("products");

      if (!restaurant) {
          return res.status(404).json({ message: "Restaurant introuvable", success: false, error : true });
      }

      return res.status(200).json({ success: true,  error : false, data : restaurant });
  } catch (error) {
      return res.status(500).json({ message: error.message || "Erreur serveur", success: false,  error : true });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const payload = req.body;
    const newRestaurant = new Restaurant(payload);
    await newRestaurant.save();
    res.status(200).json({ 
        message: 'Création du restaurant avec succès',
        success : true,
        error : false,
        data : newRestaurant
     });
  } catch (error) {
    res.status(500).json({ 
        message: 'Erreur lors de la création du restaurant',
        success : false,
        error : true
    }
    );
  }
};

const updateRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ 
        message : "Restaurant non trouvée ",
        success : false,
        error : true
    });

    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();

    res.status(200).json({ message: 'Statut mis à jour' , success : true, error : false, data : restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', success : false, error : true });
  }
};


const getCategoriesByRestaurant = async (req, res) => {
  try {
      const { restaurantId } = req.params;
      const restaurant = await Restaurant.findById(restaurantId).populate("categories");

      if (!restaurant) {
          return res.status(404).json({ message: "Restaurant introuvable", success: false, error : true });
      }

      const categories = restaurant.categories;

      return res.status(200).json({ success: true,  error : false, data : categories , message : "Catégories récupérées avec succès" });
  } catch (error) {
      return res.status(500).json({ message: error.message || "Erreur serveur", success: false,  error : true });
  }
};



module.exports = {createRestaurant, getAllRestaurants, getRestaurant, updateRestaurantStatus, getCategoriesByRestaurant}