const twilio = require('twilio');
const sendEmail = require("../helpers/email");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


exports.sendOrderConfirmation = async ({ order, user }) => {
  const logoUrl = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;
    // 💬 WHATSAPP MESSAGE
    const whatsappMessage = [
      `🍽️ Nouvelle commande Lunchy reçue !`,
      `👤 Client : ${user.name}`,
      `📧 Email : ${user.email}`,
      `📞 Téléphone : ${user.phone || "Non fourni"}`,
      `🏷️ Type du client : ${user.role}${user.role === "entreprise" && user.societe ? ` (${user.societe})` : ""}`,
      ``,
      `📍 Adresse : ${order.address}, ${order.zip_code}`,
      `📅 Date de livraison : ${new Date(order.dateLivraison).toLocaleDateString()}`,
      `Numéro de la commande : #${order.orderNumber}`,
      ``,
      `🧾 Détails de la commande :`
    ];
  
    order.items.forEach((item, index) => {
      const name = item.type === "product" ? item.product?.name : item.menu?.name;
      const customizations = item.customizations.map(c => {
        const options = c.selectedOptions.map(opt => `${opt.name} (+${opt.price.toFixed(2)} €)`).join(", ");
        return `  - ${c.name}: ${options}`;
      }).join("\n");
  
      const accompaniments = item.menuAccompaniments?.map(acc => `  - ${acc.name}`).join("\n") || "";
  
      whatsappMessage.push(
        `#${index + 1} ${item.type === "product" ? "Produit" : "Menu"} : ${name}`,
        `  Quantité : ${item.quantity}`,
        `  Total : ${item.totalItemPrice.toFixed(2)} €`,
        customizations ? `  🛠️ Personnalisations :\n${customizations}` : "",
        accompaniments ? `  🍽️ Accompagnements :\n${accompaniments}` : "",
        ``
      );
    });
  
    whatsappMessage.push(
      `🚚 Frais de livraison : ${order.deliveryFee.toFixed(2)} €`,
      `💰 Total commande : ${order.totalPrice.toFixed(2)} €`,
      ``,
    );
  
    await client.messages.create({
      body: whatsappMessage.join('\n'),
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+33773251072' // à adapter selon le destinataire
    });
  
    // 📧 EMAIL HTML
    const itemHtml = order.items.map(item => {
      const name = item.type === "product" ? item.product?.name : item.menu?.name;
      const customizations = item.customizations.map(c => `
        <div style="margin-left: 15px;">
          <strong>${c.name}:</strong>
          <ul style="margin-top: 5px;">
            ${c.selectedOptions.map(opt => `<li>${opt.name} (+${opt.price.toFixed(2)} €)</li>`).join("")}
          </ul>
        </div>
      `).join("");
  
      const accompaniments = item.menuAccompaniments?.length > 0
        ? `
          <div style="margin-left: 15px;">
            <strong>Accompagnements :</strong>
            <ul>
              ${item.menuAccompaniments.map(acc => `<li>${acc.name}</li>`).join("")}
            </ul>
          </div>
        ` : "";
  
      return `
        <li style="margin-bottom: 20px;">
          <div><strong>Type :</strong> ${item.type}</div>
          <div><strong>Nom :</strong> ${name}</div>
          <div><strong>Quantité :</strong> ${item.quantity}</div>
          <div><strong>Prix total :</strong> ${item.totalItemPrice.toFixed(2)} €</div>
          ${customizations}
          ${accompaniments}
        </li>
      `;
    }).join("");
  
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center;">
              <img src="${logoUrl}" alt="Lunchy" style="width: 120px; margin-bottom: 20px;" />
              <h2 style="color: #333;">Votre commande Lunchy a bien été reçue!</h2>
              <h3><span className='font-semibold'>Num Commande : </span>#${order.orderNumber}<h3>
            </div>
  
            <h3 style="color: #ff6600;">📞 Responsable livraison</h3>
            <p><strong>Nom :</strong> Halim Belhocine</p>
            <p><strong>Email :</strong> halimBelhocine@gmail.com</p>
            <p><strong>Téléphone :</strong> 0760135996</p>
  
            <h3 style="color: #ff6600;">📍 Adresse de livraison</h3>
            <p>${order.address}, ${order.zip_code}</p>
            <p><strong>Date prévue :</strong> ${new Date(order.dateLivraison).toLocaleDateString()}</p>
  
            <h3 style="color: #ff6600;">🔗 Annuler votre commande</h3>
            <p>
              Vous pouvez annuler votre commande à tout moment en cliquant sur le lien ci-dessous :
              <a href="${process.env.FRONTEND_URL}/moncompte" style="color: #ff6600; text-decoration: none;">Annuler ma commande</a>
            </p>
  
            <h3 style="color: #ff6600;">🧾 Détails de votre commande</h3>
            <ul style="list-style-type: none; padding-left: 0;">${itemHtml}</ul>
  
            <p><strong>Frais de livraison :</strong> ${order.deliveryFee.toFixed(2)} €</p>
            <p><strong>Total :</strong> ${order.totalPrice.toFixed(2)} €</p>
  
            <hr style="margin: 30px 0;" />
            <p style="text-align: center; color: #888;">Merci pour votre confiance 💛 Bon appétit !</p>
          </div>
        </body>
      </html>
    `;
  
    await sendEmail(user.email, "Votre commande Lunchy 🍽️", htmlContent);
  };
  