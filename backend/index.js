const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const multer = require('multer')
const app = express()
const authRouter = require('./routes/oauth')
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const {createOrderFromWebhook} = require("./controllers/orderController")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const sendInvoiceWithOAuth = require("./helpers/sendInvoiceWithOAuth")
const authToken = require('./middleware/authToken')
const Order = require("./models/order");
const helmet = require('helmet');



dotenv.config();
app.use(helmet());


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard_cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60, // 1 heure
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 heure
      httpOnly: true,
    },
  })
);

// webhook pour ecouter les evenements de paiement stripe
app.post(
    '/webhook',
    express.raw({ type: 'application/json' }), // raw() ici pour Stripe
    
  async (req, res) => {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET; 
  
      let event;
  
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.error('Erreur de vérification de signature:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
  
      console.log("Webhook reçu:", event.type);
  
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const metadata = session.metadata;

        // pour payer les commandes impayes des entreprises 
        if (metadata?.type === "bulk_unpaid_orders" && metadata.unpaidOrderIds) {
          const orderIds = JSON.parse(metadata.unpaidOrderIds);
          await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { paymentStatus: "payé" } }
          );

          console.log(`✅ ${orderIds.length} commande(s) impayée(s) ont été réglée(s)`);
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
            const chargeId = paymentIntent.latest_charge;
        
            if (!chargeId) {
              console.log("⚠️ Pas de charge disponible pour ce paiement.");
              return res.status(400).send("Charge manquante");
            }
        
            const charge = await stripe.charges.retrieve(chargeId);
        
            if (charge.status === "succeeded") {
              await sendInvoiceWithOAuth(charge);
              console.log(`✅ Facture entreprise envoyée à ${charge.billing_details.email}`);
            } else {
              console.warn("⚠️ Charge non réussie :", charge.status);
            }
          } catch (err) {
            console.error("❌ Erreur lors de l'envoi de la facture entreprise :", err.message);
          }
          return res.status(200).end();
        }

        console.log("Contenu de la session Stripe :", JSON.stringify(session, null, 2));
        // pour les utilisateurs particuliers ils payent directement
        const userId = session.metadata.userId;
        const sessionId = session.metadata.sessionId; // récupéré des metadata Stripe
        const total = session.amount_total;
        
      
        const store = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });
      
        store.get(sessionId, async (err, sessionData) => {
          if (err || !sessionData?.cart) {
            console.error("Erreur récupération session ou panier manquant :", err);
            return res.status(400).send("Panier introuvable");
          }
      
          const { items, deliveryFee, dateLivraison, adrLivraison, zip_code } = sessionData.cart;
      
          try {
            const newOrder = await createOrderFromWebhook({
              userId,
              items,
              deliveryFee,
              dateLivraison,
              adrLivraison,
              zip_code,
              paymentIntentId: session.payment_intent,
              total,
            });
      
            console.log("✅ Commande créée :", newOrder._id);
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

            const chargeId = paymentIntent.latest_charge;

            if (!chargeId) {
              console.log("⚠️ Pas de charge disponible pour ce paiement.");
              return res.status(400).send("Charge manquante");
            }

            const charge = await stripe.charges.retrieve(chargeId);

            if (charge.status === "succeeded") {
              await sendInvoiceWithOAuth(charge);
            } else {
              console.warn("⚠️ Charge non réussie :", charge.status);
            }

            res.status(200).send('Success');
          } catch (err) {
            console.error("❌ Erreur lors de la création de la commande :", err.message);
            res.status(500).send('Erreur création commande');
          }
        });
      }
      
  
    }
  );


// Configurer body-parser avec une limite plus grande
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))

// cookies
app.use(cookieParser())  // avant les routes

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.originalUrl}`);
    next();
  });

// routes
app.use('/api',router)
app.use('/', authRouter); // Route pour générer l'URL OAuth

app.get("/api/check-admin", authToken, (req, res) => {
  if (req.userEmail && req.userRole === "admin") {
    return res.json({ isAdmin: true });
  }
  return res.json({ isAdmin: false });
});



const PORT = 8002 || process.env.PORT

connectDB().then( ()=>{
    app.listen(PORT, ()=>{
        console.log("Server is running...");
        console.log('DB connected');

    })
}).catch((err)=>{
    console.log(err);
    
})




