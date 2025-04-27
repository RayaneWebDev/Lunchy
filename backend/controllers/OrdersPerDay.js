const Order = require('../models/order');

const getOrdersPerDay = async (req, res) => {
  try {
    const ordersPerDay = await Order.aggregate([
      {
        // Étape 1 : filtrer uniquement les commandes payées
        $match: { paymentStatus: "payé" },
      },
      {
        // Étape 2 : grouper par date (basé sur createdAt)
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      {
        // Étape 3 : trier les résultats par date croissante
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      error: false,
      data: ordersPerDay,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || 'Erreur interne du serveur',
    });
  }
};

module.exports = getOrdersPerDay;
