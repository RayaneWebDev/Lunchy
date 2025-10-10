const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/userModel');

const sendOtpController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'Email requis',
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      error: true,
      message: 'Aucun compte trouvé avec cet email.',
    });
  }

  try {
    const otpCode = Math.floor(1000 + Math.random() * 9000);
    const expiresIn = 10 * 60; // 10 minutes

    // Génération du token OTP
    const otpToken = jwt.sign(
      { otp: otpCode, email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn }
    );

    const logoPath = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;

    // ✅ Transporteur SMTP classique (sans OAuth2)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Ton adresse Gmail
        pass: process.env.EMAIL_PASS, // Mot de passe d’application (⚠️ pas ton vrai mot de passe Gmail)
      },
    });

    const htmlContent = `
      <html>
        <body>
          <h2>Bonjour,</h2>
          <p>Votre code OTP est :</p>
          <h3 style="color: blue;">${otpCode}</h3>
          <p>Ce code expirera dans <strong>10 minutes</strong>.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</p>
          <p><img src="cid:logoLunchy" alt="Logo Lunchy" width="200"/></p>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Lunchy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: htmlContent,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logoLunchy',
        },
      ],
    };

    // Envoi du mail (en tâche de fond pour ne pas bloquer la réponse)
    res
      .status(200)
      .json({ success: true, error: false, message: 'Code envoyé', otpToken });

    setImmediate(() => transporter.sendMail(mailOptions));
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: true, message: 'Erreur serveur' });
  }
};

const verifyOtpController = (req, res) => {
  try {
    const { otpToken, otp } = req.body;
    if (!otpToken || !otp) throw new Error('OTP et Token requis');

    const decoded = jwt.verify(otpToken, process.env.TOKEN_SECRET_KEY);
    if (decoded.otp !== parseInt(otp)) throw new Error('Code invalide');

    res.status(200).json({
      success: true,
      error: false,
      message: 'Code vérifié avec succès !',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Code expiré. Demandez-en un nouveau.',
      });
    }
    res.status(400).json({ success: false, error: true, message: 'Erreur serveur' });
  }
};

module.exports = { sendOtpController, verifyOtpController };
