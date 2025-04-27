const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    name: { type : String , required : true},
    poste : {type : String , required : false },
    rating: { type: Number, min: 1, max: 5, required: true },
    avis: { type: String, required: false }
  }, { timestamps: true });
  
  const review = mongoose.model("review", reviewSchema);
  module.exports = review;
  