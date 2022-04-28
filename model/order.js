const { object } = require('joi');
const joi = require('joi');


orderSchema = joi.object({
    name : joi.string().alphanum().required(),
    email : joi.string().email().lowercase().required(),
    phone : joi.string().pattern(new RegExp(/^[0-9]+$/)).required(),
    address: joi.object().keys({
        doorno:joi.number().required(),
        street:joi.string().required(),
        area:joi.string().required(),
        state:joi.string().required(),
        pincode:joi.string().required()
    }).required()
},
{
    timestamps:true
})




module.exports = {
    orderSchema
}