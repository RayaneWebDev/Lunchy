const addToCartModel = require("../models/cart");

const countAddToCartProduct = async (req, res) => {
    try {
        const userId = req.userId; // Vient du middleware authToken

        // Récupérer tous les documents associés à l'utilisateur
        const userCart = await addToCartModel.find({ user: userId });

        // Calculer le total des quantités
        const totalQuantity = userCart.reduce((total, cart) => total + cart.quantity, 0);

        res.json({
            data: { count: totalQuantity },
            message: 'ok',
            error: false,
            success: true
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = countAddToCartProduct;
