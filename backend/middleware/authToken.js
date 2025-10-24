const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization;
    console.log("🔑 Token reçu :", token);

    if (!token) {
      return res.status(401).json({
        message: 'Veuillez vous connecter.',
        error: true,
        success: false
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    } catch (err) {
      console.log('❌ JWT invalide ou expiré:', err.message);
      res.clearCookie('token');
      return res.status(401).json({
        message: 'Session expirée ou invalide. Veuillez vous reconnecter.',
        error: true,
        success: false
      });
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({
        message: 'Utilisateur introuvable. Veuillez vous reconnecter.',
        error: true,
        success: false
      });
    }

    if (user.isBlocked) {
      res.clearCookie('token');
      return res.status(403).json({
        message: 'Votre compte a été bloqué.',
        error: true,
        success: false
      });
    }

    // Injecte les infos utiles dans req
    req.userId = user._id;
    req.userEmail = user.email;
    req.userRole = user.role;

    return next();
  } catch (err) {
    console.error("Erreur middleware authToken :", err);
    return res.status(500).json({
      message: 'Erreur interne du serveur',
      error: true,
      success: false
    });
  }
}

module.exports = authToken;
