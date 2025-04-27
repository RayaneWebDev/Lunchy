const Event = require("../models/event");
const User = require("../models/userModel");
const sendEmail = require("../helpers/email");

// Création d'un événement avec dates ajustées
exports.createEvent = async (req, res) => {
    try {
        let { name, description, startDate, endDate, maxOrdersPerUser } = req.body;
        
        // Forcer startDate à 00:00:00 et endDate à 23:59:59 UTC
        startDate = new Date(startDate);
        startDate.setUTCHours(0, 0, 0, 0);
        
        endDate = new Date(endDate);
        endDate.setUTCHours(23, 59, 59, 999);
        
        const nowUTC = new Date();
        const isActive = nowUTC >= startDate && nowUTC <= endDate;

        const event = new Event({
            name,
            description,
            startDate,
            endDate,
            maxOrdersPerUser,
            status: isActive ? "actif" : "inactif",
            emailSent: false
        });

        await event.save();
        res.status(201).json({ success: true, error: false, data: event });

        if (isActive) {
            sendEventNotification(event);
        }
    } catch (error) {
        console.error("Erreur lors de la création de l'événement :", error);
        res.status(500).json({ message: "Erreur serveur", success: false, error: true });
    }
};

// Récupérer tous les événements
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ success: true, error: false, data: events });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: true, success: false });
    }
};

// Mettre à jour le statut d'un événement (actif/inactif)
exports.updateEventStatus = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: "Événement non trouvé", success: false, error: true });

        event.status = event.status === "actif" ? "inactif" : "actif";
        await event.save();

        res.status(200).json({ message: "Statut mis à jour", success: true, error: false, data: event });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", success: false, error: true });
    }
};

// Mettre à jour un événement
exports.updateEvent = async (req, res) => {
    try {
        let { name, description, startDate, endDate, maxOrdersPerUser } = req.body;
        
        // Forcer startDate à minuit et endDate à 23:59:59
        startDate = new Date(startDate);
        startDate.setUTCHours(0, 0, 0, 0);
        
        endDate = new Date(endDate);
        endDate.setUTCHours(23, 59, 59, 999);
        
        const nowUTC = new Date();
        const newStatus = nowUTC >= startDate && nowUTC <= endDate ? "actif" : "inactif";

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            { name, description, startDate, endDate, maxOrdersPerUser, status: newStatus },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ success: false, error: true, message: "Événement non trouvé" });
        }

        if(newStatus == "actif"){
            sendEventNotification(updatedEvent)
        }

        res.status(200).json({ success: true, error: false, message: "Événement mis à jour", data: updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Erreur lors de la mise à jour" });
    }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ message: "Événement supprimé", success: true, error: false });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", success: false, error: true });
    }
};


exports.generateFinalInvoice = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId).populate({
            path: "orders",
            populate: { path: "user", select: "name email" }
        });

        if (!event) return res.status(404).json({ message: "Événement non trouvé." , error : true, success : false });

        let invoices = {};

        // Générer une facture par entreprise
        event.orders.forEach(order => {
            if (!invoices[order.user.email]) {
                invoices[order.user.email] = {
                    company: order.user.name,
                    email: order.user.email,
                    totalAmount: 0,
                    orders: []
                };
            }

            invoices[order.user.email].totalAmount += order.totalPrice;
            invoices[order.user.email].orders.push(order._id);
        });

        // Ici, on pourrait envoyer des emails aux entreprises avec leur facture.
        // Exemple: sendEmail(invoices[company.email], "Votre facture de l'événement...");

        res.status(200).json({ message: "Factures générées.", data : invoices , error : false , success : true });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error : true, success : false });
    }
};

// Fonction pour envoyer l'email de notification
const sendEventNotification = async (event) => {
    try {
        const enterprises = await User.find({ role: "entreprise" }).select("email");
        const emailList = enterprises.map(user => user.email);

        if (emailList.length > 0) {
            const subject = `Nouvel événement : ${event.name}`;
            const htmlContent = `
                <h2>C'est ${event.name} !</h2>
                <p>${event.description}</p>
                <p>Profitez-en dès maintenant en passant plus d'une commande (max ${event.maxOrdersPerUser}) sans payer immédiatement avant la fin le ${event.endDate.toLocaleDateString()}.</p>
            `;
            await sendEmail(emailList, subject, htmlContent);
            await Event.findByIdAndUpdate(event._id, { emailSent: true });
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi des emails :", error);
    }
};