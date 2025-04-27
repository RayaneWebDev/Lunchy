const Product = require("../models/product");
const Restaurant = require("../models/Restaurant");
const Category = require("../models/categoryProduct");

const getProducts = async (req, res) => {
    try {
        
        const products = await Product.find().populate("restaurant").populate("category");

        return res.status(200).json({ success: true, error : false, data : products });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Erreur serveur", success: false , error : true });
    }
};


const addProduct = async (req, res) => {
    try {
        const { name, description, image, price, restaurant, category, customizations, isAvailable } = req.body;
        console.log("body : ",req.body)
        // Vérifier si le restaurant existe
        const restaurantExists = await Restaurant.findById(restaurant);
        if (!restaurantExists) {
            return res.status(404).json({ message: "Restaurant introuvable", success: false, error : true });
        }

        // Vérifier si la catégorie existe
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: "Catégorie introuvable", success: false, error : true });
        }

        const newProduct = new Product({
            name,
            description,
            image,
            price,
            restaurant,
            category,
            customizations,
            isAvailable
        });
        await newProduct.save();

        restaurantExists.products.push(newProduct._id)
        await restaurantExists.save()

       
        return res.status(201).json({ message: "Produit ajouté avec succès", success: true, error : false, data: newProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Erreur serveur", success: false,  error : true });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Produit introuvable", success: false,  error : true });
        }

        return res.status(200).json({ message: "Produit mis à jour avec succès", success: true, error : false, data: updatedProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Erreur serveur", success: false,  error : true });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Produit introuvable", success: false,  error : true });
        }

        await Restaurant.updateMany({}, { $pull: { products: req.params.id } });




        return res.status(200).json({ message: "Produit supprimé avec succès", success: true,  error : false });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Erreur serveur", success: false , error : true });
    }
};

const getProductsByRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const products = await Product.find({ restaurant: id }).populate("category");

        return res.status(200).json({ success: true, error : false, data : products });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Erreur serveur", success: false , error : true });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("category");

        if (!product) {
            return res.status(404).json({ message: "Produit introuvable", success: false, error : true });
        }

        return res.status(200).json({ success: true,  error : false, data : product });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Erreur serveur", success: false,  error : true });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const { restaurantId, categoryId } = req.params;

        // Récupérer les produits associés à un restaurant et à une catégorie spécifique
        const products = await Product.find({ 
            restaurant: restaurantId, 
            category: categoryId 
        }).populate("category");

        if (products.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé pour cette catégorie", success: false, error : true });
        }

        return res.status(200).json({ success: true, error : false, data : products });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", success: false, error : true });
    }
};


module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByRestaurant,
    getProductsByCategory,
    getProductById
};
