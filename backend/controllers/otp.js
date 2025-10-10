const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
require('dotenv').config();
const User = require('../models/userModel');

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const logoUrl = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>Bonjour,</h2>
          <p>Votre code OTP est :</p>
          <h3 style="color: #007bff; font-size: 24px;">${otpCode}</h3>
          <p>Ce code expirera dans <strong>10 minutes</strong>.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</p>
          <br/>
          <img src="${logoUrl}" alt="Logo Lunchy" width="150" />
        </body>
      </html>
    `;

    // ✅ Envoi du mail directement avec Resend
    const { data, error } = await resend.emails.send({
      from: 'Lunchy <onboarding@resend.dev>',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: htmlContent,
    });

    if (error) {
      console.error('❌ Erreur envoi email via Resend :', error);
      return res.status(500).json({
        success: false,
        error: true,
        message: "Erreur lors de l'envoi du mail",
      });
    }

    console.log('✅ Email envoyé via Resend :', data);

    res.status(200).json({
      success: true,
      error: false,
      message: 'Code OTP envoyé avec succès',
      otpToken,
    });

  } catch (error) {
    console.error('❌ Erreur serveur :', error);
    res.status(500).json({
      success: false,
      error: true,
      message: 'Erreur serveur. Impossible d’envoyer le code OTP.',
    });
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
    res.status(400).json({
      success: false,
      error: true,
      message: 'Erreur serveur ou code invalide',
    });
  }
};

module.exports = { sendOtpController, verifyOtpController };
