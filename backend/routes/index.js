const express = require('express')
const router = express.Router()

const userSignUpController = require('../controllers/userSignUp')
const userSignInController = require('../controllers/userSignIn')
const userDetailsController = require('../controllers/userDetails')
const userLogout = require("../controllers/userLogout")
const authToken = require('../middleware/authToken')
const resetPwdController = require("../controllers/resetPwd")
const updateProfileController = require("../controllers/updateProfile")
const {sendOtpController} = require('../controllers/otp')
const {verifyOtpController} = require("../controllers/otp")
const {sendContactEmail} = require('../helpers/emailApi')
const isAdmin = require('../middleware/isAdmin')
const allUsers = require('../controllers/allUsers')
const {toggleBlockUser} = require("../controllers/gererUser")
const {getUserOrders} = require("../controllers/gererUser")
const { createRestaurant, getAllRestaurants, updateRestaurantStatus, getRestaurant, getCategoriesByRestaurant } = require('../controllers/restaurantsController')
const {addCategory, getCategories} = require('../controllers/categoryController')
const { addProduct, getProductsByRestaurant, getProductById, updateProduct, deleteProduct, getProducts, getProductsByCategory } = require('../controllers/productController')
const { getAllCustomizations, updateCustomization, deleteCustomization, createCustomization } = require('../controllers/customizationController')
const { getMenus, getMenuById, createMenu, deleteMenu, updateMenu, getMenusByRestaurant, getMenusByCategory } = require('../controllers/menuController')
const { createEvent, getAllEvents, canCompanyOrder, generateFinalInvoice, updateEventStatus, deleteEvent, updateEvent } = require('../controllers/eventController')
const { createReview, getAllReviews, getReviewById, updateReview, deleteReview } = require('../controllers/reviewController')

const getDashboardStats = require("../controllers/getDashboardStats")
const orderController = require('../controllers/orderController')

const Product = require("../models/product")
const Menu = require("../models/menu")
const Category = require("../models/categoryProduct")
const { addToCart, getUserCart, removeFromCart, updateQuantityCart, deleteCart } = require('../controllers/cartController')
const countAddToCartProduct = require('../controllers/countAddToCart')
const getOrdersPerDay = require('../controllers/OrdersPerDay')
const getOrderStatistics = require('../controllers/OrdersStatusStat')

const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Max 5 tentatives
  message: { success: false, error: true, message: 'Trop de tentatives, veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup",userSignUpController)
router.post("/signin",loginLimiter,userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.post("/update-profile",authToken,updateProfileController)
router.get("/userLogout",userLogout)


router.post("/send-otp",sendOtpController)
router.post("/otp-verification",verifyOtpController)
router.post("/reset-password",resetPwdController)
router.post("/send-email-contact", async (req, res) => {
    const { firstName, lastName, email, company, phone, message } = req.body;
  
    try {
      sendContactEmail({ firstName, lastName, email, company, phone, message });
      res.status(200).json({ 
        message: "Email envoyé avec succès",
        success : true,
        error : false
    });
    } catch (error) {
      res.status(500).json({ 
        message: error.message,
        success : false,
        error : true
    });
    }
  });



router.get("/getRestaurants",getAllRestaurants)
router.get("/getRestaurant/:restaurantId",getRestaurant)
router.get("/getCategoriesByRestaurant/:restaurantId",getCategoriesByRestaurant)
router.get("/getProductsByCategory/:restaurantId/:categoryId", getProductsByCategory )
router.get("/getMenusByCategory/:restaurantId/:categoryId", getMenusByCategory )

//admin-panel
//users
router.get("/all-user",isAdmin,allUsers)
router.post("/all-user/:id/block",isAdmin, toggleBlockUser)
router.get("/all-user/:id/orders",isAdmin,getUserOrders)

//restaurants
router.post("/admin-panel/createRestaurant",isAdmin,createRestaurant)
router.post("/admin-panel/updateRestaurantStatus/:id",isAdmin,updateRestaurantStatus)


//categories
router.post("/admin-panel/addCategory",isAdmin,addCategory )
router.get("/admin-panel/getCategories",isAdmin,getCategories)

//products (produits simples)
router.post("/admin-panel/addProduct",isAdmin,addProduct)
router.get("/admin-panel/getProducts",isAdmin,getProducts)
router.get("/admin-panel/getProductsByResto/:id",isAdmin, getProductsByRestaurant)
router.get("/admin-panel/product/:id",isAdmin,getProductById)
router.post("/admin-panel/updateProduct/:id",isAdmin,updateProduct)
router.post("/admin-panel/deleteProduct/:id",isAdmin,deleteProduct)

//menus
router.get("/admin-panel/getMenus",isAdmin,getMenus)
router.get("/admin-panel/getMenuByResto/:id",isAdmin,getMenusByRestaurant)
router.get("/admin-panel/menus/:id",isAdmin,getMenuById)
router.post("/admin-panel/createMenu",isAdmin,createMenu)
router.post("/admin-panel/deleteMenu/:id",isAdmin,deleteMenu)
router.post("/admin-panel/updateMenu/:id",isAdmin,updateMenu)

// personnalisations
router.get("/admin-panel/getCustom",isAdmin,getAllCustomizations)
router.post("/admin-panel/createCustom",isAdmin,createCustomization)
router.put("/admin-panel/editCustom/:id",isAdmin, updateCustomization)
router.post("/admin-panel/deleteCustom/:id",isAdmin, deleteCustomization)

//events
router.post("/admin-panel/createEvent",isAdmin,createEvent)
router.get("/admin-panel/getEvents",isAdmin, getAllEvents)
router.get("/admin-panel/events/generate-invoice/:eventId",isAdmin, generateFinalInvoice)
router.delete("/admin-panel/events/deleteEvent/:eventId", isAdmin , deleteEvent)
router.post("/admin-panel/events/updateEvent/:eventId", isAdmin, updateEvent)

//reviews
router.post("/admin-panel/createReview", isAdmin , createReview)
router.get("/admin-panel/getReviews",isAdmin , getAllReviews)
router.get("/admin-panel/getReview/:reviewId", isAdmin , getReviewById)
router.post("/admin-panel/updateReview/:reviewId", isAdmin , updateReview)
router.delete("/admin-panel/deleteReview/:reviewId",isAdmin , deleteReview)

//testimonials
router.get("/getTestimonials",getAllReviews)
router.post("/createTestimonial",createReview)

//cart
router.post("/addToCart" , authToken , addToCart)
router.get("/getUserCart", authToken , getUserCart)
router.delete("/removeFromCart/:itemId", authToken , removeFromCart)
router.post("/updateQuantityCart/:itemId", authToken , updateQuantityCart)
router.post("/clearCart", authToken, deleteCart)
router.get("/countAddToCart", authToken , countAddToCartProduct)
router.get("/userCart", authToken , getUserCart)

//order
router.post("/create-order",authToken, orderController.createOrder);
router.post("/create-checkout-session",authToken, orderController.createStripeSession)
router.get("/getUserOrders",authToken, orderController.getUserOrders);
router.post("/updateOrderStatus/:orderId", orderController.updateOrderStatus);
router.post("/updateDeliveryDate/:orderId",authToken,orderController.updateDeliveryDate)
router.post("/create-checkout-session-company",authToken, orderController.createCompanyStripeSession);
router.get("/getAllOrders",isAdmin, orderController.getAllOrders);

//stats
router.get("/dashboardStats",isAdmin,getDashboardStats)
router.get("/orders-per-day",isAdmin,getOrdersPerDay)
router.get("/orders-status-stats",isAdmin,getOrderStatistics)






router.get("/produits-par-categorie/:restaurantId", async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const categories = await Category.find({ restaurant: restaurantId });

    const results = await Promise.all(
      categories.map(async (category) => {
        if (category.typeCategory === "Elémentaire") {
          const produits = await Product.find({
            category: category._id,
            restaurant: restaurantId,
          }).populate("category").populate("customizations");
          return {
            category: category.name,
            type: category.typeCategory,
            data : produits,
          };
        } 
        
        if (category.typeCategory === "Menu") {
          const menus = await Menu.find({
            category: category._id,
            restaurant: restaurantId,
          }).populate({
            path: "mainProduct",
            populate: [
              { path: "category" },
              { path: "customizations" }
            ]
          }).populate("category").populate("accompaniments.categories");
          return {
            category: category.name,
            type: category.typeCategory,
            data : menus,
          };
        }

        if (category.typeCategory === "Accompagnement") {
          const produits = await Product.find({
            category: category._id,
            restaurant: restaurantId,
          }).populate("category").populate("customizations");
          return {
            category: category.name,
            type: category.typeCategory,
            data : produits,
          };
        }

        return null;
      })
    );

    // Filtrer les résultats nuls
    const filteredResults = results.filter(Boolean);

    res.json({ success: true, error : false , data: filteredResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error : true, message: "Erreur serveur" });
  }
});



// router.post("/create-checkout-session",authToken, async (req, res) => {
//   const { cartItems } = req.body;
//   const userId = req.userId

  
  
//   // Créer les lineItems pour Stripe
//   const lineItems = cartItems.map((cartItem) => {
//     // Si c'est un produit
//     if (cartItem.type === "product") {
//       return {
//         price_data: {
//           currency: "eur",
//           product_data: {
//             name: cartItem.product.name,
//             images: [cartItem.product.image], // Ajoute l'image si nécessaire
//           },
//           unit_amount: Math.round(cartItem.totalItemprice * 100),
//         },
//         quantity: cartItem.quantity,
//       };
//     }

    
//   });

//   try {
//       const session = await stripe.checkout.sessions.create({
//           payment_method_types: ["card"],
//           line_items: lineItems,
//           mode: "payment",
//           client_reference_id : userId.toString(),
//           shipping_address_collection: {
//               allowed_countries: ['FR'], // Limite les pays autorisés
//           },
//           phone_number_collection: {
//               enabled: true, // Permet de capturer le numéro de téléphone
//           },
//           success_url: "http://localhost:5173/order-success", // Include the HTTP protocol
//           cancel_url: "http://localhost:5173/order-failed" // Include the HTTP protocol,
//       });

//       res.json({ id: session.id , success : true , error : false });
//   } catch (error) {
//       console.error("Error creating Stripe session:", error);
//       res.status(500).send({ error: "Failed to create checkout session" });
//   }
// });




module.exports = router