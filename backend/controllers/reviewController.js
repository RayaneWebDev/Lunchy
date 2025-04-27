const Review = require("../models/review");

// ✅ Ajouter un nouvel avis
exports.createReview = async (req, res) => {
    try {
        const { name, poste, rating, avis } = req.body;

        const newReview = new Review({ name, poste, rating, avis });
        await newReview.save();

        res.status(201).json({ success: true, error : false , message: "Avis ajouté avec succès", data: newReview });
    } catch (error) {
        res.status(500).json({ success: false, error : true , message: "Erreur serveur" });
    }
};

// ✅ Récupérer tous les avis
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, error : false , data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, error : true ,  message: "Erreur serveur" });
    }
};

// ✅ Récupérer un avis par ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ success: false, error : true, message: "Avis non trouvé" });
        }

        res.status(200).json({ success: true, error : false , data: review });
    } catch (error) {
        res.status(500).json({ success: false, error : true ,message: "Erreur serveur" });
    }
};

// ✅ Mettre à jour un avis
exports.updateReview = async (req, res) => {
    try {
        const { name, poste, rating, avis } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.reviewId,
            { name, poste, rating, avis },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ success: false, error : true , message: "Avis non trouvé" });
        }

        res.status(200).json({ success: true, error : false ,message: "Avis mis à jour", data: updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, error : true , message: "Erreur serveur" });
    }
};

// ✅ Supprimer un avis
exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);

        if (!deletedReview) {
            return res.status(404).json({ success: false, error : true , message: "Avis non trouvé" });
        }

        res.status(200).json({ success: true, error: false , message: "Avis supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, error : true , message: "Erreur serveur" });
    }
};
