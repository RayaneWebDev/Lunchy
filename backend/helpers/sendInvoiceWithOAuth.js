const fs = require("fs");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const path = require("path");
const sendEmail = require("./email");

async function sendInvoiceWithOAuth(charge) {
  const {
    billing_details,
    amount,
    currency,
    id: chargeId,
    created,
    receipt_url,
  } = charge;

  const invoiceNumber = `INV-${chargeId.slice(-6).toUpperCase()}`;
  const amountFormatted = (amount / 100).toFixed(2) + " €";
  const invoiceDate = new Date(created * 1000).toLocaleDateString("fr-FR");
  const logoUrl = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;

  // 1. Générer le PDF
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const filePath = path.join(__dirname, `${invoiceNumber}.pdf`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  const logoBuffer = (await axios.get(logoUrl, { responseType: "arraybuffer" })).data;
  doc.image(logoBuffer, 50, 45, { width: 120 });

  doc
    .fontSize(20)
    .text("Lunchy", 50, 150)
    .fontSize(10)
    .text("24 Rue Alphonse Daudet, 91000 Évry-Courcouronnes, France", 50, 170)
    .text("contact@lunchy.com", 50, 185)
    .text("SIRET : 123 456 789 00012", 50, 200) // Ton SIRET ici
    .text("TVA non applicable – article 293 B du CGI", 50, 215); // Mention micro-entreprise

  doc
    .fontSize(12)
    .text(`Facture à : ${billing_details.name}`, 350, 150)
    .text(`${billing_details.address.line1}`, 350, 165)
    .text(`${billing_details.address.postal_code} ${billing_details.address.city}`, 350, 180)
    .text(`${billing_details.email}`, 350, 195);

  doc
    .fontSize(14)
    .text(`Facture N° : ${invoiceNumber}`, 50, 240)
    .text(`Date : ${invoiceDate}`, 50, 260);

  doc.moveDown().moveTo(50, 290).lineTo(550, 290).stroke();
  doc
    .fontSize(12)
    .text("Description", 50, 300)
    .text("Montant", 450, 300)
    .moveTo(50, 320)
    .lineTo(550, 320)
    .stroke();

  doc
    .fontSize(12)
    .text("Commande Lunchy", 50, 330)
    .text(amountFormatted, 450, 330);

  doc.moveTo(50, 350).lineTo(550, 350).stroke();

  doc
    .fontSize(14)
    .text("Total à payer :", 350, 370)
    .text(amountFormatted, 450, 370);

    // ✅ Mentions légales supplémentaires
    doc
    .fontSize(10)
    .fillColor("black")
    .text("Mode de paiement : Carte via Stripe", 50, 400)
    .text("Date de règlement : À réception", 50, 415)
    .text("Pénalités de retard : 10% du montant total par mois de retard", 50, 430);

  doc
    .fontSize(10)
    .fillColor("gray")
    .text("Merci pour votre commande sur Lunchy !", 50, 450);

  doc.end();

  await new Promise((resolve) => writeStream.on("finish", resolve));

  // 2. Lire le fichier PDF en Buffer
  const pdfBuffer = fs.readFileSync(filePath);

  // 3. Contenu du mail
  const htmlContent = `
    <div style="font-family: Arial, sans-serif;">
      <img src="${logoUrl}" alt="Lunchy Logo" style="width: 120px;" />
      <h2>Merci pour votre commande !</h2>
      <p>Bonjour ${billing_details.name},</p>
      <p>Vous trouverez en pièce jointe votre facture n° <strong>${invoiceNumber}</strong>.</p>
      <p>Montant : <strong>${amountFormatted}</strong></p>
      <p><a href="${receipt_url}">Voir le reçu Stripe</a></p>
    </div>
  `;

  // 4. Envoi de l'email avec la pièce jointe en Buffer
  await sendEmail(billing_details.email, "Votre facture Lunchy", htmlContent, [
    {
      filename: `${invoiceNumber}.pdf`,
      content: pdfBuffer, // Contenu du fichier PDF en Buffer
      contentType: 'application/pdf',
    },
  ]);

  // 5. Supprimer le fichier PDF après l'envoi
  fs.unlinkSync(filePath); 
  console.log("Facture envoyée à", billing_details.email);
}

module.exports = sendInvoiceWithOAuth;



