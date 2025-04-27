const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const sendWelcomeEmail = require('../helpers/sendWelcomeEmail')
async function userSignUpController(req, res) {

  try {
    const { email, password, name ,address, phone , societe, zip_code} = req.body

    if (!email) throw new Error("Veuillez entrer un email");
    if (!password) throw new Error("Veuillez entrer un mot de passe");
    if (!name) throw new Error("Veuillez entrer votre nom complet");
    if (!phone) throw new Error("Veuillez entrer votre numéro de téléphone");
    if (!address) throw new Error("Veuillez entrer votre adresse");
    if (!zip_code) throw new Error("Veuillez entrer votre code postal");

    const user = await userModel.findOne({ email })
    if (user) {
      throw new Error("Cet utilisateur existe déja")
    }

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)

    let role = societe ? "entreprise" : "particulier";
 

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
      role, // Par défaut "particulier" ou "entreprise"
      societe: societe || null,
      address,
      zip_code,
      phone,
    });

    await newUser.save()


    res.status(200).json({
      data: newUser,
      error: false,
      success: true,
      message: "Utilisateur crée avec succès"
    })

    setImmediate(() => sendWelcomeEmail(email, name));


  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    })
  }
}

module.exports = userSignUpController
