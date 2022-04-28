const user = require('../model/sig.model');
const sms = require('../middleware/otp')
const {totp,hotp} = require('otplib');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// const { update } = require('../model/sig.model');
const mail = require('../middleware/email');
const fastSms = require('fast-two-sms');
require('dotenv').config();




hotp.options = { digits: 4 };






const register = (req,res,next)=>{

    bcrypt.hash(req.body.password,10,function(err,hashedpass){
        if(err){
            res.json({'error':err.message});
        }
        const data =new user({
            username : req.body.username,
            email:req.body.email,
            mobileNumber:req.body.mobileNumber,
            password:hashedpass,
            
        });
        data.save()
        .then(data=>{
            return res.json({status:'success',message:'userDetails successfully added!','result':data})
        }).catch(error=>{
            return res.json({status:'failure',message:error.message});
        })
    })
}



 const login =(req,res,next)=>{
    try{
    var username = req.body.username
    var password = req.body.password
   user.findOne({$or:[{email:username},{mobileNumber:username}]}).then(data=>{
       console.log(data);
        if(data){
            bcrypt.compare(password,data.password, function(err,result){
                if(err){
                    console.log('error');
                    res.json(err.message);
                }
                if(result){
                    let token =  jwt.sign({name:data.username},'secretkey',{expiresIn:'2hr'})
                    
                    const digit = sms.otpSend() 
                    console.log(digit);
                    let SMS = {
                        authorization:process.env.FAST2SMS,
                        message: "Through a login use the OTP : "+digit,
                        numbers:[ data.mobileNumber]
                    }
                    fastSms.sendMessage(SMS).then(result=>{
                        console.log(result)
                    }).catch(err=>{
                        console.log(err)
                    })
                    return user.updateOne({otp:digit},(err)=>{   
                         if(err){
                         return res.json({'error':err.message})
                        }else{
                            return res.json({status:'success',message:'login successfull!',token,data})
                        }

                    })                 

                }else{
                    res.json({
                            message:"password doesn't matched please enter the correct password"
                    })
                }
            })
        }else{
            res.json({
                message:'user not found!'
            })
        }
    })

}catch(err){
    res.json({'error':err.message});
}

}

const logout = async (req,res,next)=> {
    try{
        const date = moment().toDate()
        console.log(date);

        await user.findOneAndUpdate({uuid:req.params.uuid},{new:true}).exec();
        return res.json({message:'logout success','logintstatus':false,'latestVisited':date});
    }catch(err){
        res.json({status:'failure',message:err.message}); 
    }


}

const forgetPassword=(req,res,next)=>{
    try{
   const {email} = req.body;
    user.findOne({email},(err,data)=>{
        if(err || !data){
            return res.json({message:'user does not exists with that email'});
            }
            let token = jwt.sign({name:data.name},'secretkey',{expiresIn:'30m'})
                    res.json({
                        message:'you requested for password reset',
                        token
                    })
            //  return  user.updateOne({resetLink:token},(err,sucess)=>{
            //      if(err){
            //         return res.json({'error':'not update resetlink'}); 
            //      }else{
            //          return res.json({'resetLink':resetLink})
            //      }
                
            //     })       
            
            })

    }catch(error){
        res.json({"error":error.message});
    }
}

const resetPassword = (req,res,next)=>{
    try{
    const {resetLink,newPass}=req.body

    if(resetLink){
        jwt.verify(resetLink,'secretkey',(err,decodedData)=>{
            if(err){
              return res.json({'error':'Incorrect token or it is expired.'});
            }
            if(decodedData){
                user.findOneAndUpdate({newPass: user.password});
                return res.json({status:"success",message:"resetPassword successful!"})
            }
            // user.findOne({resetLink},(err,data)=>{
            //     if(err || !data){
            //     return res.json({'error':'user with this token does not exist.'})
            //     }
            // })
        })
    }else{
        return res.json({'error':'Authentication error!!!'});
    }
}catch(err){
    res.json({'error':err.message});
}
}


const sendMail = async(req,res,next)=>{
    try{
        const sec = 'key'
        const counter = 2
        const token = hotp.generate(sec,counter)
        console.log(token);

    const tomail = req.body.email
    const subject = req.body.subject
    const text = token
    let mailData={
        from : 'jagan.platosys@gmail.com',
        to : tomail,
        subject : subject,
        text : text,
        fileName : 'message.ejs',
        attachments:[
            {
                fileName:"java_tutorial.pdf",
                filePath:'https://www.tutorialspoint.com/java/java_tutorial.pdf'
            },
            {
                fileName:"Rolls_royals.jpg",
                filePath:"https://cdn.lifestyleasia.com/wp-content/uploads/sites/7/2020/09/02191145/2021-rolls-royce-ghost-details.jpg"
            }
        ]

    }
    let data = await mail.mailSending(mailData)
    return res.json({status:'success',message:'mail sended successfull!'});
    }catch(err){
       return res.json({status:'failure',message:err.message})
    }
}
 
 
module.exports={
    register,login,logout,forgetPassword,resetPassword,sendMail
}

