const Customization = require("../models/customizationModel");
const Product = require("../models/product");

exports.createCustomization = async (req, res) => {
    try {
        const { name, maxOptions, required, options } = req.body;

        const customization = new Customization({ name, maxOptions, required, options });
        await customization.save();

        res.status(201).json({ message: "Personnalisation créée",success : true, error : false , data : customization });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur",success : false , error : true});
    }
};

exports.getAllCustomizations = async (req, res) => {
    try {
        const customizations = await Customization.find();
        res.status(200).json({
            success : true, error : false , data : customizations
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur",success : false, error : true  });
    }
};

exports.addCustomizationToProduct = async (req, res) => {
    try {
        const { productId, customizationId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé", success : false, error : true
             });
        }

        const customization = await Customization.findById(customizationId);
        if (!customization) {
            return res.status(404).json({ message: "Personnalisation non trouvée", success : false, error : true });
        }

        if (!product.customizations.includes(customizationId)) {
            product.customizations.push(customizationId);
            await product.save();
        }

        res.status(200).json({ message: "Personnalisation ajoutée au produit", success : true, error : false , data : product });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", success : false, error : true });
    }
};

exports.updateCustomization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, maxOptions, required, options } = req.body;

        const customization = await Customization.findByIdAndUpdate(
            id,
            { name, maxOptions, required, options },
            { new: true }
        );

        if (!customization) {
            return res.status(404).json({ message: "Personnalisation non trouvée", success : false, error : true , data : customization});
        }

        res.status(200).json({ message: "Personnalisation mise à jour",success : true, error : false, customization });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur",success : false, error: false });
    }
};

exports.deleteCustomization = async (req, res) => {
    try {
        const { id } = req.params;

        await Customization.findByIdAndDelete(id);

        await Product.updateMany(
            { customizations: id },
            { $pull: { customizations: id } }
        );

        res.status(200).json({ message: "Personnalisation supprimée", success : true, error : false });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", success : false, error : true });
    }
};


