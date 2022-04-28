const router = require('express').Router();
const { json } = require('express/lib/response');
const vehicleSchema= require("../model/cars.model");
const {authVerify, isAdmin} = require('../middleware/auth.mid');
const category = require('../model/category');
const moment = require('moment');

 //addNew Vehicles Details
router.post("/addvehicles",async(req,res)=>{
    try{
        const data = new vehicleSchema(req.body);
        const result =await data.save();
        return res.status(200).json({'status':'success','message':'veihcle details added successfully'}) 

    }catch(error){
        console.log(error.message);
        res.status(400).json({'status':'failure','message':error.message})

    }
});


router.get("/getVehicle",authVerify,async(req,res)=>{
    try{
    const vehicleDetails = await vehicleSchema.find().exec();
    if(vehicleDetails.length > 0){
        return res.status(200).json({'status': 'success', message: "you will get vehicles details", 'result': vehicleDetails});
    }else{
        return res.status(404).json({'status': 'failure', message: "vehicle details you will not submited"})
    }
}catch(error){
    console.log(error.message);
    return res.status(400).json({'status':'failure',message:error.message})
}

})
router.get("/getIndVehicle/:id",authVerify,async(req,res)=>{
    
    try{
        const vehicleDetails = await vehicleSchema.findById(req.params.id);
    if(vehicleDetails){
        return res.status(200).json({'status': 'success', message: "vehicle details submited", 'result': vehicleDetails});
    }else{
        return res.status(404).json({'status': 'failure', message: "vehicle details not submited"});
    }
     }catch(error){
        console.log(error.message);
        return res.status(400).json({'status':'failure',message:error.message})
    }
});

router.put("/getUpdate",authVerify,async(req,res)=>{
try{
    const contain = {"id": req.body.id};
    const updateDetail = req.body.updateDetail;
    const rule = {new : true};
    const data = await vehicleSchema.findOneAndUpdate(contain,updateDetail,rule).exec(); 
    return res.status(200).json({'status': 'success', message: "vehicle details updated", 'result': data});

}catch(error){
    return res.status(400).json({'status':'failure',message:error.message})
}
});

router.delete("/deleteVehicle/:id",authVerify,async(res,req)=>{
    try {
        console.log(req.params.id)
        await productSchema.findOneAndDelete({uuid: req.params.id}).exec();
        return res.status(200).json({'status': 'success', message: "vehicle details deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});


//category feched vehicle and user get category date bassed
router.get('/userChoiceVehicle',async(req,res)=>{
    try{

       let vehicleDetails = await category.aggregate([
        {
            $match:{

                $and:[
                     {'uuid':'CAT-52FA3A4DBC3B2732022152416'},
                     {"userUuid": 'REG-A4F1C252A9A6'},
                     
                ]
            }
        },


           {
               $lookup:{
                   from:'vehicles',
                   localField:'uuid',
                   foreignField:'categoryUuid',
                   as:'vehicle_Details'
               } 
              
           },  
           {
           
            $lookup:{
                from:'users',
                localField:'userUuid',
                foreignField:'uuid',
                as:'user_Datas',
                              
            }

           },

           
        // {
        //     $unwind:{
        //         path:'$vehicle_Details',
        //         preserveNullAndEmptyArrays:true
        //     }
        // },
        
         {
            $project: {
                "_id": 0,
            }
        },
        {
            $sort:{categoryName:1}
        },{
            $skip:0
        },
        {
            $limit:3
        },
        ])
        if(vehicleDetails){
            return res.json({status:'success',message:"vehicleDetails fetched succussfully",'result':vehicleDetails}); 
        }else{
            return res.json({status:'failure',message:'vehicleDetails is not available'});
        }
    }catch(err){
          return res.json({
            message:err.message
        })
    }
});
//get vehicle date bassed 
router.get('/dateBassedVehicles',async(req,res)=>{
    try{
    let startDate = req.query.startDate
    let endDate = req.query.endDate
    let date1 = moment(startDate).format('YYYY-MM-DDT00:00:00.000Z')
    let date2 = moment(endDate).format('YYYY-MM-DDT23:59:59.000Z')
    const vehicleInfo = await vehicleSchema.aggregate([
        {
            $match:{
                $and:[
                     
                     { createdAt: {
                        $gt: new Date(date1),
                        $lte: new Date(date2),
                     }, 
                     },
                ],
            },
        },
    
        // {
        //     $lookup:{
        //        from:'users',
        //        localField:'userUuid',
        //        foreignField:'uuid',
        //        as:'user_Datas' 
        //     },
        // },
        {
            $sort:{model:1}
        },
        {
            $project: {
                "_id": 0,
                "uuid":0,
                "categoryUuid":0,
                "userUuid":0,
                "updatedAt":0
            }
        },
       
    ]) 
    if(vehicleInfo){
        return res.json({status:'success',message:"vehicleDetails fetched succussfully",'result':vehicleInfo}); 
    }else{
        return res.json({status:'failure',message:'vehicleDetails is not available'});
    } 
    }catch(err){
        res.json({status:'failure',message:err.message});
    }
     
})


router.get('/getUserbasedVehicle/:userUuid',async(req,res)=>{
    try{
        const vehicleDetails = await vehicleSchema.find({userUuid:req.params.userUuid}).exec();
        if(vehicleDetails){
            res.json({
                status:'success',message:'vehicle details feched successfully!','result':vehicleDetails
            })
        }else{
           return res.json({ status:'failure',message:'vehicleDetails not availabel!'});
        }
    }catch(err){
        res.json({'error':err.message});
    }
})


router.post('/addCategory',async(req,res)=>{
    try{
        const categoryDetails = new category(req.body);
        const result = await categoryDetails.save();
            return res.json({status:'success',message:'category successfully added!','result':result});
    }catch(err){
        return res.json({
            'error':err.message
        })
    }
});




module.exports = router;