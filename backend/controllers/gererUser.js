const userModel = require("../models/userModel")
const Order = require("../models/order")

async function toggleBlockUser(req,res){
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" , success : false, error : true});
    
        user.isBlocked = !user.isBlocked; 
        await user.save();
    
        res.status(200).json({ 
          message: `Utilisateur ${user.isBlocked ? 'bloqué' : 'débloqué'} avec succès`, 
          data : user,
          success : true,
          error : false
        });
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' || error , success: true, error : false });
      }
    
}

async function getUserOrders(req,res) {
    try {
        const orders = await Order.find({ user: req.params.id }).populate('restaurant products');
    
        if (!orders.length) {
          return res.status(404).json({ message: "Aucune commande trouvée pour cet utilisateur" , success : false, error : true });
        }
    
        res.status(200).json({ 
            message : "Commandes trouvées avec succès",
            success : true,
            error : false,
            data : orders
        });
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error :true, success : false });
      }
}


module.exports = {getUserOrders, toggleBlockUser}