const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

const vehicleRoutes = require('./routes/cars.routes');
const logSchema = require('./routes/sig.routes');
//const order = require('./routes/order.route');


const app = express();
app.use(cors());
app.use(express.urlencoded({extended:false}));

app.get("/",async(req,res)=>{
    console.log("it work");
    res.send(`success`);
});
//let dbUrl1='mongodb+srv://Jagan17:jagan5021@cluster0.eddpn.mongodb.net/user?retryWrites=true&w=majority';
let dbUrl2='mongodb://localhost:27017/sigin';
mongoose.connect(dbUrl2,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(data=>{
    console.log("Database connected")
}).catch(err=>{
    console.log(err.message)
    process.exit(1);
})

app.use(express.json());
app.set('view engine', 'ejs');

app.use('/api/v1',vehicleRoutes);
app.use('/api/v2',logSchema);
//app.use('/api/v3',order)

app.listen(3000,()=>{
    console.log("server starting..........")
});
