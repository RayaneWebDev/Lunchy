const cron = require("node-cron");
const Event = require("../models/event");
const User = require("../models/userModel");
const sendEmail = require("./email");

cron.schedule("0 0 * * *", async () => {
    try {
        const nowUTC = new Date();


        // Activer les événements qui doivent l'être
        const activeEvents = await Event.find({
            status: "inactif",
            startDate: { $lte: nowUTC },
            endDate: { $gte: nowUTC }
        });
        //console.log("Événements censés être actifs :", activeEvents);

        for (const event of activeEvents) {
            if (!event.emailSent) {
                const enterprises = await User.find({ role: "entreprise" }).select("email");
                const emailList = enterprises.map(user => user.email);

                if (emailList.length > 0) {
                    const subject = `Nouvel événement : ${event.name}`;
                    const htmlContent = `
                        <h2>c'est le ${event.name}!</h2>
                        <p>${event.description}</p>
                        <p>Profitez-en dès maintenant avant la fin le ${new Date(event.endDate).toLocaleDateString()}.</p>
                    `;
                    
                    await sendEmail(emailList, subject, htmlContent);
                    event.emailSent = true;
                    await event.save();
                    console.log(`📧 Email envoyé à ${emailList.length} entreprises pour l'événement "${event.name}".`);
                }
            }
        }

        // Désactiver les événements terminés
        const deactivateResult = await Event.updateMany(
            { status: "actif", endDate: { $lt: nowUTC } },
            { $set: { status: "inactif", emailSent: false } }
        );

        // Activer les événements dans la période correcte
        const activateResult = await Event.updateMany(
            { status: "inactif", startDate: { $lte: nowUTC }, endDate: { $gte: nowUTC } },
            { $set: { status: "actif" } }
        );

        //console.log(`✅ Mise à jour terminée : ${activateResult.modifiedCount} activé(s), ${deactivateResult.modifiedCount} désactivé(s)`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des événements :", error);
    }
});
