const twilio = require('twilio');
const sendEmail = require("../helpers/email");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.sendCancelOrder = async ({ order, user }) => {
    const deliveryName = "Halim Belhocine";
    const deliveryPhone = "+33773251072";
    const deliveryEmail = "halimBelhocine@gmail.com";
  
    // WhatsApp
    const whatsappMessage = [
      `❌ Une commande Lunchy a été annulée.`,
      ``,
      `👤 Client : ${user.name}`,
      `📧 Email : ${user.email}`,
      `📍 Adresse : ${order.address}, ${order.zip_code}`,
      `📅 Livraison prévue : ${new Date(order.dateLivraison).toLocaleDateString()}`,
      ``,
      ` La commande numéro ${order.orderNumber} a été supprimée du système.`,
    ];
  
    await client.messages.create({
      body: whatsappMessage.join("\n"),
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:' + deliveryPhone
    });
  
    // Email
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center;">
              <h2 style="color: #d9534f;">Commande #${order.orderNumber} annulée</h2>
              <p style="color: #555;">Bonjour ${user.name},</p>
              <p>Votre commande prévue pour le <strong>${new Date(order.dateLivraison).toLocaleDateString()}</strong> a bien été annulée.</p>
            </div>
            
            <h3 style="color: #ff6600;">📍 Détails :</h3>
            <p><strong>Adresse :</strong> ${order.address}, ${order.zip_code}</p>
            <p><strong>Total :</strong> ${order.totalPrice.toFixed(2)} €</p>
  
            <h3 style="color: #ff6600;">Besoin d'aide ?</h3>
            <p>Contactez notre responsable livraison :</p>
            <ul>
              <li><strong>Nom :</strong> ${deliveryName}</li>
              <li><strong>Email :</strong> ${deliveryEmail}</li>
              <li><strong>Téléphone :</strong> ${deliveryPhone}</li>
            </ul>
  
            <p style="color: #888; text-align: center;">Merci d’avoir choisi Lunchy. À bientôt !</p>
          </div>
        </body>
      </html>
    `;
  
    await sendEmail(user.email, "Confirmation d'annulation Lunchy ❌", htmlContent);
  };