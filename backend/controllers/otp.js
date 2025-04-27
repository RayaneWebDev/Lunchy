const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const { google } = require("googleapis");
require('dotenv').config();
const User = require("../models/userModel")


const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendOtpController = async (req, res) => {

    const { email } = req.body;
        if (!email) throw new Error("Email et nom requis");

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Aucun compte trouvé avec cet email."
            });
        }


    try {

        const otpCode = Math.floor(1000 + Math.random() * 9000); 
        const expiresIn = 10 * 60; 

        // Génération du token OTP
        const otpToken = jwt.sign({ otp: otpCode, email }, process.env.TOKEN_SECRET_KEY, { expiresIn });


        const logoPath = `https://res.cloudinary.com/dnlgpkskm/image/upload/v1743774691/logo_ualmf3.jpg`;
       const accessToken = await oAuth2Client.getAccessToken();
       
           const transporter = nodemailer.createTransport({
             service: "gmail",
             auth: {
               type: "OAuth2",
               user: process.env.EMAIL_USER, // Ton email Gmail
               clientId: CLIENT_ID,
               clientSecret: CLIENT_SECRET,
               refreshToken: REFRESH_TOKEN,
               accessToken: accessToken.token, // Token d'accès
             },
           });

        const htmlContent = `
            <html>
              <body>
                <h2>Bonjour,</h2>
                <p>Votre code OTP est :</p>
                <h3 style="color: blue;">${otpCode}</h3>
                <p>Ce code expirera dans <strong>10 minutes</strong>.</p>
                <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorez ce mail</p>
                <p><img src="cid:logoLunchy" alt="Logo Lunchy" width="200"/></p>

              </body>
            </html>
          `;

        const mailOptions = {
                from: `"Lunchy" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Réinitialisation du mot de passe",
                html: htmlContent,
                attachments: [
                  {
                    filename: "logo.png",
                    path: logoPath,
                    cid: "logoLunchy", // Identifiant utilisé dans <img src="cid:logoLunchy">
                  },
                ],
              };
       

        res.status(200).json({ success: true, error : false ,  message: "code envoyé", otpToken });
        setImmediate(()=> transporter.sendMail(mailOptions)) ;


    } catch (error) {
        res.status(400).json({ success: false, error : true, message: "Erreur serveur" });
    }
};

const verifyOtpController = (req, res) => {
    try {
        const { otpToken, otp } = req.body;
        if (!otpToken || !otp) throw new Error("OTP et Token requis");

        const decoded = jwt.verify(otpToken, process.env.TOKEN_SECRET_KEY);
        if (decoded.otp !== parseInt(otp)) throw new Error("code invalide");

        res.status(200).json({ 
            success: true,
            error : false,
            message: "code vérifié avec succès !" });

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ 
                success: false,
                error : true,
                message: "code expiré. Demandez-en un nouveau." });
        }
        res.status(400).json({ success: false, error : true , message: "Erreur serveur" });
    }
};

module.exports = { sendOtpController, verifyOtpController };
