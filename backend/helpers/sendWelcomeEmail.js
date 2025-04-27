const { Resend } = require('resend');
require("dotenv").config(); // Charger les variables d'environnement

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const logoURL = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>Bienvenue sur Lunchy, ${userName} !</h2>
          <img src="${logoURL}" alt="Logo Lunchy" width="150" />
          <p>Merci de vous être inscrit sur notre plateforme.</p>
          <p>Nous sommes ravis de vous avoir parmi nous.</p>
        </body>
      </html>
    `;

    const emailData = {
      from: 'Lunchy <onboarding@resend.dev>', 
      to: userEmail,
      subject: "Bienvenue sur Lunchy",
      html: htmlContent,
    };

    const { data, error } = await resend.emails.send(emailData);

    if (error) throw error;
    console.log("✅ Email de bienvenue envoyé via Resend :", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'e-mail de bienvenue :", error);
  }
};

module.exports = sendWelcomeEmail;





// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// require("dotenv").config(); // Charger les variables d'environnement

// const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
// const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const sendWelcomeEmail = async (userEmail, userName) => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();
//     console.log("access token : ",accessToken)

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: process.env.EMAIL_USER, // Ton email Gmail
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken.token, // Token d'accès
//       },
//     });

//     const logoPath = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;

//     const htmlContent = `
//       <html>
//         <body>
//           <h2>Bienvenue sur Lunchy, ${userName} !</h2>
//           <img src="cid:logoLunchy" alt="logo"/>
//           <p>Merci de vous être inscrit sur notre plateforme.</p>
//           <p>Nous sommes ravis de vous avoir parmi nous.</p>
//         </body>
//       </html>
//     `;

//     const mailOptions = {
//       from: `"Lunchy" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: "Bienvenue sur Lunchy",
//       html: htmlContent,
//       attachments: [
//         {
//           filename: "logo.png",
//           path: logoPath,
//           cid: "logoLunchy",
//         },
//       ],
//     };


//     // Envoi de l'email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("E-mail envoyé : ", info.response);
//     return info;
//   } catch (error) {
//     console.error("Erreur lors de l'envoi de l'e-mail :", error);
    
//   }
// };

// module.exports = sendWelcomeEmail;
