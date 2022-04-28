
   
const mongoose = require('mongoose');
const crypto = require('crypto')

const categorySchema = new mongoose.Schema({
    uuid:{type:String,required:false},
    categoryName:{type:String,required:true},
    categorydec:{type:String,required:true},
    userUuid:{type:String,required:true}
},{
    timestamps:true
})


const timestamp = new Date()
const date = timestamp.getDate()+''+timestamp.getMonth()+''+timestamp.getFullYear();
const time = timestamp.getHours()+''+timestamp.getMinutes()+''+timestamp.getSeconds();

categorySchema.pre('save',function(next){
    this.uuid="CAT-"+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()+date+time;
    console.log({"uuid":this.uuid});
    next()
})

module.exports=mongoose.model('category',categorySchema)