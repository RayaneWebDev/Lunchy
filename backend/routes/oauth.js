var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
dotenv.config();

// Importer le modèle utilisateur
const User = require('../models/userModel');

/* POST /login - Connexion utilisateur avec JWT */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Utilisateur non trouvé" });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Mot de passe incorrect" });
        }

        // Créer un JWT
        const tokenData = {
            _id: user._id,
            email: user.email
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '24h' });

        // Définir les options du cookie
        const tokenOption = {
            httpOnly: true, // Pas accessible via JavaScript côté client
            secure: true
        };

        // Définir le cookie avec le token JWT
        res.cookie('token', token, tokenOption).status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.profileImage,
            },
            token: token,
            message: "Connexion réussie."
        });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/* POST /register - Inscription utilisateur */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "GENERAL"
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Utilisateur créé avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

module.exports = router;
