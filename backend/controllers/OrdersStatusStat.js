const Order = require('../models/order');

const getOrderStatistics = async (req, res) => {
  try {
    // Récupérer le nombre total de commandes
    const totalOrders = await Order.countDocuments();

    if (totalOrders === 0) {
      return res.status(200).json({
        success: true,
        data: {
          confirmedOrders: 0,
          cancelledOrders: 0,
          paidOrders: 0,
          unpaidOrders: 0,
        },
      });
    }

    // Statistiques des commandes confirmées et annulées
    const confirmedOrders = await Order.aggregate([
      { $match: { status: { $in: ['confirmé', 'annulée'] } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        }
      }
    ]);

    const cancelledOrders = confirmedOrders.find(order => order._id === 'annulée')?.count || 0;
    const confirmedOrdersCount = confirmedOrders.find(order => order._id === 'confirmé')?.count || 0;

    // Calcul des pourcentages de commandes confirmées et annulées par rapport au total des commandes
    const cancelledPercentage = (cancelledOrders / totalOrders) * 100;
    const confirmedPercentage = (confirmedOrdersCount / totalOrders) * 100;

    // Statistiques des commandes payées et impayées
    const paidOrders = await Order.aggregate([
      { $match: { paymentStatus: { $in: ['payé', 'impayé'] } } },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        }
      }
    ]);

    const unpaidOrders = paidOrders.find(order => order._id === 'impayé')?.count || 0;
    const paidOrdersCount = paidOrders.find(order => order._id === 'payé')?.count || 0;

    // Calcul des pourcentages de commandes payées et impayées par rapport au total des commandes
    const unpaidPercentage = (unpaidOrders / totalOrders) * 100;
    const paidPercentage = (paidOrdersCount / totalOrders) * 100;

    // Envoyer les résultats au frontend
    res.status(200).json({
      success: true,
      data: {
        confirmedOrders: confirmedPercentage.toFixed(1),
        cancelledOrders: cancelledPercentage.toFixed(1),
        paidOrders: paidPercentage.toFixed(1),
        unpaidOrders: unpaidPercentage.toFixed(1),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Erreur interne du serveur",
    });
  }
};

module.exports = getOrderStatistics;
