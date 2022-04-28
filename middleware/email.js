const nodemailer = require('nodemailer');
const ejs = require('ejs');
const {join} = require('path');
require('dotenv').config();
const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SG_KEY);

//console.log(process.env.SG_KEY);

// const transporter = nodemailer.createTransport({
//    service:'gmail',
//     auth:{
//         user : process.env.EMAIL,
//         pass : process.env.PASS
//     },
// });


async function mailSending(mailData){
    try{
        console.log('sucess');
        const data = await ejs.renderFile(join(__dirname ,'../temp/',mailData.fileName),mailData, mailData.details)
            
         
        const mailDetails = {
            from : mailData.from,
            to : mailData.to,
            subject : mailData.subject,
            text : mailData.text,
            attachments : mailData.attachments,
            html : data
        }
        sendGrid.send(mailDetails,(err,data)=>{
        if(err)
        console.log('mail not sended'+err.message);
        else
        console.log('Mail is sended');
    })
}catch(err){
    console.log(err.message);
    process.exit(1);
}

}


module.exports={
    mailSending
}