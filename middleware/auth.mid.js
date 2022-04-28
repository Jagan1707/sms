const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function authVerify (req,res,next){
    try {
        console.log("verify token");
        let token = req.header("token");
        if(!token){
            return res.json({status: "failure", message: "Unauthorised access"});
        }
        const decode = jwt.verify(token, 'secrectKey');
        console.log(decode)
        next();
    } catch (error) {
        console.log(error.message)
        return res.json({status: "failure", message: "Invalid token"})
    }    
}

function isAdmin (req,res,next){
    try{
        console.log("verify token");
        let token = req.header("token")
        if(!token){
            return res.json({status: "failure", "message": "Unauthorised access"})
        }
        const decode = jwt.verify(token, 'secrectKey');
        console.log(decode.uuid)
        let userdetails =  user.findOne({uuid: decode.uuid}).exec()
        console.log(userdetails)
        if(decode.role === "admin"){
            console.log("yes he is admin")
            next();
        }else{
            return res.json({status: "failure", "message": "Unauthorised access"})
        }       
    }catch(error){
        console.log(error.message)
        return res.json({status: "failure", message: "Invalid token"})
    }
}

module.exports = {
    authVerify: authVerify,
    isAdmin: isAdmin
}