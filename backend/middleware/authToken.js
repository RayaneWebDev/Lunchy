async function authToken(req, res, next) {
  try {
    // Récupération du token : cookie ou header Authorization
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    console.log('Token brut reçu:', token);

    if (!token) {
      return res.status(401).json({
        message: 'Please Login!',
        error: true,
        success: false,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY, { algorithms: ['HS256'] });
      console.log('JWT validé:', decoded);

      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(401).json({
          message: 'Utilisateur introuvable, veuillez vous reconnecter.',
          error: true,
          success: false,
        });
      }

      if (user.isBlocked) {
        res.clearCookie("token");
        return res.status(403).json({
          message: 'Votre compte a été bloqué.',
          error: true,
          success: false,
        });
      }

      req.userId = decoded._id;
      req.userEmail = decoded.email;
      req.userRole = decoded.role;
      return next();
    } catch (err) {
      console.log('Échec du JWT:', err.message);
    }

    return res.status(401).json({
      message: 'Invalid or expired token. Please Login!',
      error: true,
      success: false,
    });
  } catch (err) {
    console.error('Erreur authToken:', err);
    res.status(500).json({
      message: err.message || 'Erreur inconnue',
      error: true,
      success: false,
    });
  }
}
