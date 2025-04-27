require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    const emailData = {
      from: 'Lunchy <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html: htmlContent,
    };

    // Valider les pièces jointes
    const validAttachments = attachments
      .filter(att => att.content && att.filename)
      .map(att => ({
        filename: att.filename,
        content: att.content, // Buffer ou base64
        contentType: att.contentType || 'application/pdf',
      }));

    // Si des pièces jointes sont valides, on les ajoute
    if (validAttachments.length > 0) {
      emailData.attachments = validAttachments;
    }

    // Envoi de l'email via Resend
    const { data, error } = await resend.emails.send(emailData);

    if (error) throw error;
    console.log("✅ Email envoyé via Resend", data);
    return data;
  } catch (err) {
    console.error("❌ Erreur envoi email avec Resend :", err);
    throw err;
  }
};

module.exports = sendEmail;












// require('dotenv').config();
// const { google } = require("googleapis");
// const nodemailer = require("nodemailer");


// const logoPath = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;

// const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
// const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const sendEmail = async (to, subject, htmlContent, attachments = []) => {
//     const accessToken = await oAuth2Client.getAccessToken();
    
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             type: "OAuth2",
//             user: process.env.EMAIL_USER, // Ton email Gmail
//             clientId: CLIENT_ID,
//             clientSecret: CLIENT_SECRET,
//             refreshToken: REFRESH_TOKEN,
//             accessToken: accessToken.token, // Token d'accès
//           },
//         });

//     const mailOptions = {
//         from: `"Lunchy" <${process.env.EMAIL_USER}>`,
//         to: Array.isArray(to) ? to.join(",") : to,
//         subject,
//         html: htmlContent,
//         attachments: [
//             {
//               filename: "logo.png",
//               path: logoPath,
//               cid: "logoLunchy", // Identifiant utilisé dans <img src="cid:logoLunchy">
//             },
//             ...attachments,
//           ],
//     };

//     return transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
