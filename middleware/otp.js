const {authenticator,totp,hotp} = require('otplib');
require('dotenv').config();

totp.options = { digits: 4 };
hotp.options = { digits: 4 };


function sendOpt(type){
    if(type == 'send'){
   const secrate = 'secrate_key'
   const token = totp.generate(secrate);
   console.log(token);
    }else if(type == 'resend'){
            const secrate = 'secrate_key'
            const token = totp.generate(secrate);
            console.log(token);
    }

}

function otpSend(){
    const secrate = 'key'
    const token = totp.generate(secrate)
    return token
}

otpSend();

function example(){
    const sec = 'key'
    const counter = 2
    const token = hotp.generate(sec,counter)
    console.log(token);
}

//example();


function verify(){
    const secrate = 'secrate_key'
    const token = totp.generate(secrate);
    console.log(token);
    const compare = totp.check(token,secrate);
    console.log(compare)
}

//   sendOpt('send')
//    verify();



module.exports ={
    otpSend,verify,sendOpt
}