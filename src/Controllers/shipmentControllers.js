const { Items, Users, Shipments } = require('../models');
const authService = require('./../services/authService');
const shipmentservice = require('./../services/shipment');
const itemservices = require('./../services/itemService');
const modeService = require('./../services/modeService');
const jwt = require('jsonwebtoken');
const {v4} = require('uuid');
const uuid = v4;

const createShipment = async(req, res)=>{
    const {destination, shipMethod, items} = req.body;
    const {token} = req.headers
    try{
        console.log(req.body);
        console.log(req.headers);
        const resp = await authService.toknVerification(token);
        if(resp.error) return res.status(resp.error.code).send(resp.error.message);
        
        if(! resp.decoder.email) return res.status(403).send("Please sign up first");
        const shipmentCode = () =>{
            if (shipMethod === "By air") {
                return("AR"+ Math.floor(1000 + Math.random() * 9000));
              } 
              else if (shipMethod === "BY road") {
                return("RD"+ Math.floor(1000 + Math.random() * 9000));
              } 
              else if (shipMethod === "By train"){
                return("TR"+ Math.floor(1000 + Math.random() * 9000));
              }
              else{
                  return("invalid SHipment Method")
              }
            }
            var receivingDate = new Date();
            receivingDate.setDate(receivingDate.getDate() + 3);
        let codeValue = shipmentCode();
        console.log(codeValue)
        const resp2 = await modeService.getModeByName(shipMethod);
        if(resp2.error) return res.status(resp2.error.code).send(resp2.error.message);
        let shipment = {id:uuid(), destination , shipMethod,
        ShipmentCode: codeValue,
        receivingDate,
        bookingDate: Date(),
        userId: resp.decoder.id,
        modeId: resp2.mode.id
        };
        console.log(shipment)
        console.log(resp2.mode.rate);
        const resp3 = await shipmentservice.createShipment(shipment);
        if(resp3.error) return res.status(resp3.error.code).send(resp3.error.message);
        console.log(resp3)
        for (i=0; i< items.length ; i++ ){
            items[i].id= uuid();
            items[i].shipmentId= resp3.createdShipment.id;
            const resp7 = await itemservices.createItem(items[i]);
            if (resp7.error) return res.status(resp7.error.code).send(resp7.error.message);
            console.log(resp7)

        }
        const resp5 = await itemservices.getItemByShipmentId(resp3.createdShipment.id);
        if(resp5.error) return res.status(resp5.error.code).send(resp5.error.message);
        let totalWeight = resp5.items.reduce((a, b)=> (a + b.weight), 0)
        console.log(totalWeight);
        let totalCharges= totalWeight * resp2.mode.rate;
        console.log({charges:totalCharges})
        const resp6 = await shipmentservice.updateShipmentCharges(totalCharges,resp3.createdShipment.id );
        if(resp6.error) return res.status(resp6.error.code).send(resp6.error.message);
        const resp7 = await shipmentservice.getShipmentById(resp3.createdShipment.id) ; 
        if(resp7.error) return res.status(resp7.error.code).send(resp7.error.message);
        console.log({shipment:resp7.shipment})
        return res.status(200).send( {shipment:resp7.shipment} );

    }
    catch(err){
        console.error(err);
        res.status(500).send( "Something went wrong. Please try again");
    }
}
const getShipments = async(req, res)=>{
    try{
        let modes = await Shipments.findAll({where:{active: "true"},
            include: {
              model: Items,
              required: true
            }
          })
          ;
         return  res.status(200).send({orders: modes});
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const getShipmentById = async(req, res)=>{
    const {id} = req.params
    try{
        const resp = await shipmentservice.getShipmentById(id) ; 
        if(resp.error) return res.status(resp.error.code).send(resp.error.message);
        res.status(200).send(resp.shipment)
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }};
const getShipmentByUser = async(req, res)=>{
    const {id} = req.params
    try{
        let shipment = await Users.findOne({where:{id:id, active:"true"},
            attributes: {exclude: ['userPassword','createdAt' ,'updatedAt']},
            include: {
              model: Shipments,
              required: true,
              attributes: {exclude: ['createdAt' ,'updatedAt']},
              include:{
                  model: Items,
                  required: true
              }
            }});
          
        
        res.status(200).send(shipment);
    } catch(error){     
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};

const deleteShipment = async(req, res)=>{
    const {id} = req.params
    const {token} = req.headers
    const {email} = req.body
    try{
        const resp = await authService.toknVerification(token);
        if(resp.error) return res.status(resp.error.code).send(resp.error.message);
       if(resp.decoder.email != email && resp.decoder.role != "admin")return res.status(403).send("Please sign up first");
       const resp2 = await shipmentservice.getShipmentById(id) ; 
        if(resp2.error) return res.status(resp2.error.code).send(resp2.error.message);
        const resp3 = await shipmentservice.deleteShipment(id);
        if(resp3.error) return res.status(resp3.error.code).send(resp3.error.message);
        res.status(200).send({Message:"deleted successfully"})

    } catch(error){     
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};


module.exports =
{
    createShipment,
    getShipments,
    getShipmentById,
    getShipmentByUser,
    deleteShipment

}
