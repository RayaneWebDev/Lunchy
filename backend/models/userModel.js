const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,  
  },
  role: { 
    type: String, 
    enum: ["particulier", "entreprise", "admin"], 
    default: "particulier" 
  },
  societe: { type: String, default: null }, 
  address: {
    type: String,
    required: false,
  },
  zip_code : {
    type : String,
    required : true
  },
  phone: {
    type: String,  
    required: false,
    validate: {
      validator: function (v) {
        return /^0[1-9](\d{2}){4}$/.test(v); // Validation pour un numéro de téléphone français qui commence par 0
      },
      message: (props) => `${props.value} n'est pas un numéro de téléphone valide !`,
    },
  },
  isBlocked: { type: Boolean, default: false }
  
}, {
  timestamps: true,
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
