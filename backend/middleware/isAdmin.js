const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const isAdmin = async (req, res, next) => {
    try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1] || Cookies.get('token');
        if (!token) {
            return res.status(401).json({ message: "Accès non autorisé !" });
        }
        console.log("token : ",token)
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY, { algorithms: ['HS256'] });
        const user = await userModel.findById(decoded._id);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé, droits insuffisants !" });
        }

        req.user = user; // On ajoute l'utilisateur à req pour l'utiliser plus tard
        next();
    } catch (error) {
        res.status(401).json({ message: "Session expirée ! veuilez vous reconnectez" });
    }
};

module.exports = isAdmin;
