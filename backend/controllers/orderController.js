const Order = require("../models/order");
const User = require("../models/userModel");
const Menu = require("../models/menu")
const Product = require("../models/product")
const Event = require("../models/event");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const {sendOrderConfirmation} = require("../helpers/sendOrderConfirmation");
const { sendCancelOrder } = require("../helpers/sendCancelOrder");
const { sendDeliveryDateUpdate } = require("../helpers/sendDeliveryDateUpdate");



const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, dateLivraison, deliveryFee, address, zip_code } = req.body;

    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isEntreprise = user.role === "entreprise";

    const activeEvent = await Event.findOne({
      startDate: { $lte: dateLivraison },
      endDate: { $gte: dateLivraison }
    });
    console.log(activeEvent)

    const unpaidOrdersCount = await Order.countDocuments({
      user: userId,
      paymentStatus: "impayé",
    });

    let eventId = null;
    let paymentStatus = "payé";

    if (isEntreprise) {
      paymentStatus = "impayé";
      if ((unpaidOrdersCount > 0) && !activeEvent) {
        return res.status(400).json({
          success: false,
          message: "Vous devez d'abord payer vos commandes impayées avant de passer une nouvelle commande."
        });
      }

      if (activeEvent) {
        const eventOrdersCount = await Order.countDocuments({
          user: userId,
          event: activeEvent.name,
          status : "confirmé"
        });

        if (eventOrdersCount < activeEvent.maxOrdersPerUser) {
          eventName = activeEvent.name;
        } else {
          return res.status(400).json({
            success: false,
            message: "Vous avez atteint le nombre max de commandes possibles sans paiement immédiat pendant " + activeEvent.name,
          });
        }
      }
    }
    const generateUniqueOrderNumber = async () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const prefix = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
      const digits = Math.floor(10000000 + Math.random() * 90000000); // 8 chiffres
      return `${prefix}${digits}`;
    };

    const orderNumber = await generateUniqueOrderNumber();
    // Création de la commande
    const newOrder = new Order({
      user: userId,
      deliveryFee,
      dateLivraison,
      address,
      zip_code,
      items,
      totalPrice,
      paymentStatus,
      event: eventName,
      orderNumber
    });

    await newOrder.populate([
      { path: "items.product", select: "name" },
      { path: "items.menu", select: "name" },
      { path: "items.menuAccompaniments", select: "name" }
    ]);

    await newOrder.save();

    res.status(201).json({
      success: true,
      error: false,
      message: "Commande créée avec succès",
      order: newOrder
    });

   
            // 📲 Envoi du message WhatsApp
    sendOrderConfirmation({order : newOrder , user})
   
  } catch (error) {
    console.error("Erreur createOrder :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createStripeSession = async (req, res) => {
  const { items, deliveryFee, userId, dateLivraison, adrLivraison , zip_code } = req.body;
  req.session.cart = {
    items,
    deliveryFee,
    dateLivraison,
    adrLivraison ,
    zip_code
  };
  await req.session.save(); 
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.type == "product" ? item.product.name : item.menu.name,
            images: [item.type == "product" ? item.product.image : item.menu.image], // Ajoute l'image si nécessaire
          },
          unit_amount: Math.round((item.totalItemPrice / item.quantity)*100),
        },
        quantity: item.quantity,
      })),
    
      metadata: {
        userId: userId.toString(),
        sessionId: req.sessionID,
        productIds: JSON.stringify(items.filter(i => i.type === 'product').map(i => i.product?._id || i._id)),
        menuIds: JSON.stringify(items.filter(i => i.type === 'menu').map(i => i.menu?._id || i._id)),
        deliveryFee: deliveryFee.toString(),
        dateLivraison : dateLivraison
      },
    
      client_reference_id: userId.toString(),
    
      shipping_address_collection: {
        allowed_countries: ['FR'],
      },
      phone_number_collection: {
        enabled: true,
      },
    
      success_url: `${process.env.FRONTEND_URL}/order-success`,
      cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
    });
    

    res.json({ id: session.id , success : true , error : false });
  } catch (err) {
    console.error("Erreur création session Stripe:", err);
    res.status(500).json({ error: 'Erreur création session paiement' });
  }
};



const createOrderFromWebhook = async ({ userId,items, deliveryFee , dateLivraison, paymentIntentId, total, adrLivraison, zip_code }) => {
  // 1. Récupérer l'utilisateur
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  const generateUniqueOrderNumber = async () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    const digits = Math.floor(10000000 + Math.random() * 90000000); // 8 chiffres
    return `${prefix}${digits}`;
  };

  const orderNumber = await generateUniqueOrderNumber();

  // 4. Créer une nouvelle commande
  const newOrder = new Order({
    user: userId,
    address: adrLivraison,
    zip_code: zip_code,
    dateLivraison, // Ou utilise une date depuis metadata si disponible
    deliveryFee,
    items,
    orderNumber,
    totalPrice: total / 100, // Total payé (en euros)
    paymentStatus: "payé", // Statut du paiement
    status: "confirmé", // Statut de la commande
  });

  // 5. Populate les informations nécessaires des produits et menus pour l'Order
  await newOrder.populate([
    { path: "items.product", select: "name price" },
    { path: "items.menu", select: "name price" },
    { path: "items.menuAccompaniments", select: "name price" },
  ]);

  // 6. Sauvegarder la commande dans la base de données
  await newOrder.save();

  // 7. Envoyer la confirmation de commande (par email ou autre notification)
  sendOrderConfirmation({ order: newOrder, user });

  return newOrder;
};


// Récupérer les commandes d'un utilisateur
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 })

    res.status(200).json({ success: true, error : false , data : orders });
  } catch (error) {
    res.status(500).json({ success: false, error : true, message: error.message });
  }
};

// Récupérer les commandes d'un restaurant

// Mettre à jour le statut de la commande (ex: Confirmé, Annulée)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ success: false, error: true, message: "Commande introuvable" });
    }

    if (order.status === "annulée") {
      return res.status(400).json({ success: false, message: "Cette commande est déjà annulée." });
    }

    order.status = "annulée";
    await order.save();

    sendCancelOrder({ order, user: order.user });

    res.status(200).json({ success: true, error: false, order, message: "Commande annulée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, error: true, message: error.message });
  }
};


const updateDeliveryDate = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { dateLivraison } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { dateLivraison },
      { new: true }
    ).populate("user");

     sendDeliveryDateUpdate({ order : updatedOrder, user : updatedOrder.user });

    res.status(200).json({ success: true,error : false , order: updatedOrder , message :"Date mise à jour avec succès"});
  } catch (error) {
    res.status(500).json({ success: false, error : true , message: error.message });
  }
};


const createCompanyStripeSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { totalAmount, unpaidOrderIds } = req.body;

    if (!totalAmount || !unpaidOrderIds?.length) {
      return res.status(400).json({ success: false, message: "Montant ou commandes manquants." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: `Paiement de ${unpaidOrderIds.length} commande(s) impayée(s)`,
          },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      }],
      metadata: {
        userId: userId.toString(),
        unpaidOrderIds: JSON.stringify(unpaidOrderIds),
        type: "bulk_unpaid_orders"
      },
      client_reference_id: userId.toString(),
      success_url: `${process.env.FRONTEND_URL}/order-success`,
      cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
    });

    res.json({ id: session.id, success: true });
  } catch (err) {
    console.error("Erreur Stripe session impayées :", err);
    res.status(500).json({ success: false, message: "Erreur de création de session Stripe." });
  }
};

const getAllOrders = async(req,res) => {


  try{
      const orders = await Order.find().sort({createdAt : -1}).populate("user")

     return res.status(200).json({
          success : true,
          error : false,
          message : "Orders fetched successfully",
          data : orders
      })
  }
  catch(error){
    return  res.status(400).json({
          success : false,
          error : true,
          message : "Error in getting orders"
      })
  }

  
}



module.exports = {
  createOrder,
  createStripeSession,
  createOrderFromWebhook,
  getUserOrders,
  updateOrderStatus,
  updateDeliveryDate,
  createCompanyStripeSession,
  getAllOrders,

};
