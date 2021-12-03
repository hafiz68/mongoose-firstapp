const express = require ("express");
const app = express();
const cors = require ("cors");
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const modeRoutes = require('./routes/modesRoutes');
const shipmentroutes = require('./routes/sipmentRoutes');
const { Items } = require('./models/items');
const { ShipmentModes } = require('./models/shipment-modes');
const { Shipments } = require('./models/shipments');
const { Users } = require('./models/users');

app.use(cors());
app.use(express.json());
app.use("/deliveryapp", userRoutes);
app.use("/deliveryapp", modeRoutes);
app.use("/deliveryapp", shipmentroutes);

const dotenv = require('dotenv');
dotenv.config();

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DB_CONNECTION_STRING,{ autoIndex: false });
        console.log("db connected");
    }catch(error){
        console.log(error)
    }
}
app.use("/", (req, res)=>{ 
    return res.send({message:"Server is listening at 192.168.0.171:5000"});
})
app.listen(5000, '192.168.0.171', async ()=>{
    await connectDB();
    console.log("You are on port 5000");
});

