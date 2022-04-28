const router = require('express').Router();
const userSchema = require('../model/sig.model');
const mail = require('../middleware/email')
const auth = require('../controller/Auth');


router.post('/sigin',auth.register);

router.post('/login',auth.login);

router.post('/logout/:uuid',auth.logout);

router.post('/forgetPass',auth.forgetPassword);

router.post('/resetPass',auth.resetPassword);


router.post('/sendMail',async(req,res)=>{
    try{
         const toMail = req.body.toMail
         const subject = req.body.subject
         //const text = req.body.text
         const link='https://medium.com/shriram-navaratnalingam/send-emails-with-ejs-template-using-nodemailer-800b8f1a012d'
        var mailData={
            from:'jagan.platosys@gmail.com',
            to :toMail,
            subject:subject,
          //  text :text,
            fileName : 'message.ejs',
            attachments : [
                {
                    filename : 'java_tutorial.pdf',
                    filPath : 'C:/Users/sandh/Downloads/java',
                    href : "https://www.tutorialspoint.com/java/java_tutorial.pdf",
                    contentType: 'application/pdf'
                },
                {
                    fileName:'rolls_royals.jpg',
                    href :'https://cdn.lifestyleasia.com/wp-content/uploads/sites/7/2020/09/02191145/2021-rolls-royce-ghost-details.jpg'
                }
            ],
            details:{
                name:'jagan',
                date:new Date(),
                link : 'https://medium.com/shriram-navaratnalingam/send-emails-with-ejs-template-using-nodemailer-800b8f1a012d'
            }
         }
        let data = await mail.mailSending(mailData);
         return res.status(200).json({status: "success", message: "Mail sent successfully"})
          
    }catch(err){
        res.json({status:'failure',message:err.message})
    }
})


   

module.exports=router
