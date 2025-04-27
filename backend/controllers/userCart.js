const Cart = require("../models/cart")

const getUserCart = async(req,res)=>{
    try{
        const currentUser = req.userId

        const allProduct = await Cart.find({
            user : currentUser
        }).populate("product").populate("menu").populate("menuAccompaniements.product")

        res.json({
            data : allProduct,
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports =  getUserCart