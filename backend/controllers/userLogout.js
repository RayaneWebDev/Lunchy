async function userLogout(req,res){
    try{
        res.clearCookie("token", { path: "/", httpOnly: true, secure: true, sameSite: "None" });

        res.json({
            message : "Déconnexion réussie",
            error : false,
            success : true,
            data : []
        })
    } catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = userLogout