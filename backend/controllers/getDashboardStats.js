const Order = require('../models/order');
const User = require('../models/userModel');
const Product = require('../models/product');
const Menu = require("../models/menu")

const getDashboardStats = async (req, res) => {
  try {
    // 1. Total des revenus
    const totalRevenue = await Order.aggregate([
        { $match: { paymentStatus: "payé" } }, // ✅ Ne garder que les commandes payées
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);
      

    // 2. Total de commandes
    const totalOrders = await Order.countDocuments();

    // 3. Total d'utilisateurs
    const totalUsers = await User.countDocuments();

    // 4. Nouveaux utilisateurs (inscrits dans les 30 derniers jours)
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    // 5. Total de produits
    const totalProducts = await Product.countDocuments();
    const totalMenus = await Menu.countDocuments();

    const totalItems = totalProducts + totalMenus;

    // 6. Commandes récentes
    const recentOrders = await Order.aggregate([
      { $sort: { createdAt: -1 } }, // on trie avec createdAt car tu n'as pas de "orderDate"
      { $limit: 7 },
      {
        $project: {
          _id: 0,
          date: '$createdAt', // renommage
          total: '$totalPrice',
          products: '$items',
        },
      },
    ]);

    // 7. Réponse
    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        totalUsers,
        newUsers,
        totalItems,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = getDashboardStats;
