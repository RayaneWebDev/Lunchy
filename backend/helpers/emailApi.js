const sendEmail = require('./email');
require('dotenv').config();

const logoUrl = `https://res.cloudinary.com/dj5m5lvpi/image/upload/v1741008249/zkhhwtabqey77mthzxmx.png`;

const sendWelcomeEmail = (userEmail, userName) => {
    const htmlContent = `
      <html>
        <body>
        <img src="${logoUrl}" alt='logo image' width="200" />
        <h2>Bienvenue sur Lunchy, ${userName} !</h2>
          <p>Merci de vous être inscrit sur notre plateforme.</p>
          <p>Nous sommes ravis de vous avoir parmi nous.</p>
        </body>
      </html>
    `;

    return sendEmail(userEmail, "Bienvenue sur Lunchy", htmlContent);
};


const sendContactEmail = (data) => {
    const htmlContent = `
      <html>
        <body>
          <img src="${logoUrl}" alt='logo image' width="200" /
          <h2>Message de Contact</h2>
          <p><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Société :</strong> ${data.company ? data.company : 'Non précisé'}</p>
          <p><strong>Téléphone :</strong> ${data.phone}</p>
          <p><strong>Message :</strong><br/>${data.message}</p>
        </body>
      </html>
    `;

    return sendEmail(process.env.EMAIL_USER, "Message de Contact", htmlContent);
};




module.exports = {sendContactEmail, sendWelcomeEmail}