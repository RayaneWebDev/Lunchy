const mongoose = require("mongoose");
const userModel = require("../models/userModel");

async function updateProfile(req, res) {
    try {
      const { email, name, address, zip_code, phone, societe } = req.body;
      const userId = req.userId; // Utilisation de req.userId défini dans le middleware
  
      console.log("userId profile:", userId.toString());
  
      // 1. Vérifier si userId est valide
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: `Invalid userId format: ${userId}. Expected an ObjectId.`,
          error: true,
          success: false,
        });
      }
  
      // 2. Vérifier si l'utilisateur existe
      const sessionUserDetails = await userModel.findById(userId);
      if (!sessionUserDetails) {
        return res.status(404).json({
          message: "Utilisateur connecté introuvable.",
          error: true,
          success: false,
        });
      }
  
      // 3. Construire l'objet de mise à jour
      const payload = {
        ...(email && { email }),
        ...(name && { name }),
        ...(address && { address }),
        ...(zip_code && { zip_code }),
        ...(phone && { phone }),
        ...(societe && { societe }),
      };
  
      // 4. Mettre à jour l'utilisateur
      const updatedUser = await userModel.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({
          message: "Utilisateur introuvable pour mise à jour.",
          error: true,
          success: false,
        });
      }
  
      // 5. Répondre avec les nouvelles données
      res.json({
        data: updatedUser,
        message: "Utilisateur mis à jour avec succès.",
        success: true,
        error: false,
      });
    } catch (err) {
      console.error("Erreur dans updateProfile:", err.message);
      res.status(500).json({
        message: err.message,
        error: true,
        success: false,
      });
    }
  }
  

module.exports = updateProfile;
