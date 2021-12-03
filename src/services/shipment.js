const {Shipments, Items, Users} = require('../models');


const createShipment = async(shipment) => {
    try {
        const createdShipment = await Shipments.create(shipment);
        if(!createdShipment) return {error: {message: "Something went wrong, try again", code: 500}};
        return {createdShipment: createdShipment.toJSON()};
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};
const updateShipment = async(shipment, id) => {
    try {
        const updatedShipment = await Shipments.update( shipment, {where: { shipmentId: id}, raw: true});
        if(!updatedShipment) return {error: {message: "Something went wrong, try again", code: 500}};
        return {updatedShipment: updatedShipment};
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};
const updateShipmentCharges = async(charges, id) => {
    try {
        const updatedShipment = await Shipments.update( {charges : charges}, {where: { id: id}, raw: true});
        if(!updatedShipment) return {error: {message: "Something went wrong, try again", code: 500}};
        return {updatedShipment: updatedShipment};
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};
// const getUserByEmail = async(email)=>{
//     try{
//         let user = await Users.findOne({where:{userEmail:email}});
//          return  {user:user.toJSON()};
//     } catch(error){
//         console.log(error);
//         return {error: {message: "Something went wrong, try again", code: 500}};
//     }
    
// };
const getShipments = async()=>{
    try{
        let shipments = await Shipments.findAll({where:{active: true}});
        
         return  {shipments};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const getShipmentById = async(id)=>{
    try{
        let shipment = await Shipments.findOne({where:{id:id , active: true},
            include: {
              model: Items,
              required: true
            
          }});
         return  {shipment:shipment.toJSON()};
    } catch(error){     
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const deleteShipment = async(id)=>{
    try{
        let shipment = await Shipments.update({active:false},{where:{id:id}});
        return {message: "Deleted successfully"};
    } catch(error){     
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};



module.exports = {
    createShipment,
    // getUserByEmail,
    updateShipment, 
    getShipments,
    getShipmentById,
    updateShipmentCharges,
    deleteShipment
}