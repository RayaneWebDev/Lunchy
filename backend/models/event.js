const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    emailSent: { type: Boolean, default: false },
    status: { 
        type: String, 
        enum: ["actif", "inactif"], 
        default: "inactif" 
    },
    maxOrdersPerUser: { type: Number, required: true, default: 5 }, 
}, { timestamps: true });

const Event = mongoose.model("events", eventSchema);
module.exports = Event;
