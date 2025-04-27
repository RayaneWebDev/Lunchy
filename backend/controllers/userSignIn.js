const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function userSignInController(req,res) {

    try{
        const {email , password} = req.body

        if(!email){
            throw new Error("Veuillez entrer votre email")
        }

        if(!password){
            throw new Error("Veuillez entrer votre mot de passe")
        }
        const user = await userModel.findOne({email})

        if(!user){
          return  res.status(404).json({success : false, error : true, message : "Utilisateur non trouvé"})
           }

        if(user.isBlocked){
          return  res.status(403).json({success : false, error : true, message : "Votre compte est bloqué, connexion impossible"})
        }
        
        const checkPassword = await bcrypt.compare(password,user.password)

        console.log("checkPWD : ",checkPassword)

        if(checkPassword){
            const tokenData = {
                _id : user._id,
                email : user.email,
                role: user.role
            }

            const token = jwt.sign(
                tokenData,
                process.env.TOKEN_SECRET_KEY , { expiresIn : 60 *60 *60*60 }
            )

            const tokenOptions = {
                httpOnly: true,  // Empêche l'accès au cookie via JavaScript
                secure: process.env.NODE_ENV === 'production',  // Assure la sécurité en production (HTTPS uniquement)
                sameSite: 'Strict',  // Empêche l'envoi du cookie dans les requêtes inter-domaines
                maxAge: 60*60*60 // Durée de vie du cookie en ms (60h dans cet exemple)
            };

            res.cookie("token",token,tokenOptions).status(200).json({
                message : "Connexion avec succès",
                data : token,
                success : true,
                error : false
            })
        }

        else {
            throw new Error("Mot de passe incorrect")
        }
         
    } catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
    
}


module.exports = userSignInController