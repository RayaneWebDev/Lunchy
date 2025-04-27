const express = require('express');
const bcrypt = require('bcryptjs');
const User = require("../models/userModel")

 const resetPwdController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false,error : true, message: "Email et mot de passe requis" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false,error : true, message: "Utilisateur non trouvé" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, error : false, message: "Mot de passe mis à jour avec succès" });

    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe :", error);
        res.status(500).json({ success: false, error : true, message: "Erreur serveur" });
    }
};

module.exports = resetPwdController;
