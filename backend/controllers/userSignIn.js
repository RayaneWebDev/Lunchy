const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ success: false, error: true, message: "Veuillez entrer votre email" });
    }

    if (!password?.trim()) {
      return res.status(400).json({ success: false, error: true, message: "Veuillez entrer votre mot de passe" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: true, message: "Utilisateur non trouvé" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, error: true, message: "Votre compte est bloqué, connexion impossible" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: true, message: "Mot de passe incorrect" });
    }

    const tokenPayload = {
      _id: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, {
      expiresIn: '3d' // expire dans 3 jours (tu peux adapter)
    });

    // Options du cookie
    const tokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'none', 
      maxAge: 3 * 24 * 60 * 60 * 1000 // 3 jours en ms
    };

    res.cookie('token', token, tokenOptions);

   return res.status(200).json({
    message: "Connexion réussie",
    success: true,
    error: false,
    token,
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }})

  } catch (err) {
    console.error("Erreur dans userSignInController :", err);
    return res.status(500).json({
      success: false,
      error: true,
      message: err.message || "Erreur interne du serveur"
    });
  }
}

module.exports = userSignInController;
