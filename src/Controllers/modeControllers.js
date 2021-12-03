const {ShipmentModes} = require('../models');
const authService = require('./../services/authService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createMode = async(req,res) => {
    const {token} = req.headers;
    const newShipment = req.body;
    try {
        const resp = await authService.toknVerification(token);
        if(resp.error) return res.status(resp.error.code).send(resp.error.message);
        if(resp.decoder.role !== 'Admin') return res.status(403).send("unautorized user");
        const createdMode = await ShipmentModes.create(newShipment);
        if(!createdMode) return {error: {message: "Something went wrong, try again", code: 500}};
        return res.status(200).send({createdMode: createdMode.toJSON()});
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};
const updateMode = async(req, res) => {
    const {id} = req.params;
    const newMODE = req.body;
    try {
        const updatedMode = await ShipmentModes.update( newMODE, {where: { id: id}, raw: true});
        if(!updatedMode) return {error: {message: "Something went wrong, try again", code: 500}};
        return res.status(200).send("Mode updated");
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};

const getModes = async(req, res)=>{
    try{
        let modes = await ShipmentModes.findAll();
         return  res.status(200).send({modes});
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const getModeById = async(req, res)=>{
    const {id} = req.params;
    try{
        let mode = await ShipmentModes.findOne({where:{ id:id}});
         return  res.status(200).send({mode});
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const getModeByQuery = async(req, res)=>{
    const {modeName} = req.params;
    try{
        let mode = await ShipmentModes.findOne({where:{ modeName:modeName}});
         return  res.status(200).send({mode});
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};

module.exports = {
    createMode,
    updateMode, 
    getModes,
    getModeById
}
