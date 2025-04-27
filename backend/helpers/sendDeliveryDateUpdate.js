const twilio = require('twilio');
const sendEmail = require("../helpers/email");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.sendDeliveryDateUpdate = async ({ order, user }) => {
  const logoUrl = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;

  // 📲 WHATSAPP POUR RESPONSABLE LIVRAISON
  const whatsappMessage = [
    `📅 Mise à jour de commande Lunchy !`,
    `Le client a modifié la date de livraison de sa commande.`,
    ``,
    `👤 Client : ${user.name}`,
    `📞 Téléphone : ${user.phone || "Non fourni"}`,
    `📧 Email : ${user.email}`,
    `🏷️ Type : ${user.role}${user.role === "entreprise" && user.societe ? ` (${user.societe})` : ""}`,
    ``,
    `🆕 Nouvelle date de livraison : ${new Date(order.dateLivraison).toLocaleDateString()}`,
    `📍 Adresse : ${order.address}, ${order.zip_code}`,
    ``,
    `🧾 Commande n°${order.orderNumber}`
  ];

  await client.messages.create({
    body: whatsappMessage.join('\n'),
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+33773251072' // responsable
  });

  // 📧 EMAIL CLIENT
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center;">
            <img src="${logoUrl}" alt="Lunchy" style="width: 120px; margin-bottom: 20px;" />
            <h2 style="color: #333;">Modification de votre commande Lunchy</h2>
          </div>

          <p>Bonjour ${user.name},</p>

          <p>Nous vous confirmons que la date de livraison de votre commande num ${order.orderNumber} a bien été modifiée.</p>

          <h3 style="color: #ff6600;">📍 Nouvelle date de livraison</h3>
          <p><strong>Adresse :</strong> ${order.address}, ${order.zip_code}</p>
          <p><strong>Date prévue :</strong> ${new Date(order.dateLivraison).toLocaleDateString()}</p>

          <p style="margin-top: 30px;">Merci pour votre confiance 💛</p>
          <p>L’équipe Lunchy</p>
        </div>
      </body>
    </html>
  `;

  await sendEmail(user.email, "Modification de votre commande Lunchy 📅", htmlContent);
};
