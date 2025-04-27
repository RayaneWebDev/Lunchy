const categoryModel = require("../models/categoryProduct")
const restaurantModel = require("../models/Restaurant")

async function addCategory(req,res) {
    try{
        const {category, restaurant, typeCategory} = req.body
        const restaurantCategory = await restaurantModel.findById(restaurant)
        if(!restaurantCategory){
            return res.status(404).json({ message: "Restaurant introuvable", success: false, error: true });
        }

        const oldCategory = await categoryModel.findOne({name : category, restaurant})
        if(oldCategory){
            return res.status(400).json({ message: "Cette catégorie existe déjà", success: false , error : true});
        }
        
        const newCategory = await new categoryModel({name : category, restaurant , typeCategory})
        await newCategory.save()
        
        restaurantCategory.categories.push(newCategory._id)
        await restaurantCategory.save()
        res.status(200).json({
            message : "Categorie ajoute avec succes",
            success : true,
            error : false
        })

    } catch(error){
        res.status(500).json({
            message : "Erreur dans ajout de la categorie",
            success : false,
            error : true
        })
    }
}


async function getCategories(req,res) {
    try {
        const categories = await categoryModel.find();

        res.status(200).json({ 
            message : "Liste des categories récupéree avec succès",
            success : true,
            error : false,
            data : categories
        });
      } catch (error) {
        res.status(500).json({ 
            message: 'Erreur dans get des categories',
            success : false,
            error : true
        });
      }
}


module.exports = {addCategory, getCategories}