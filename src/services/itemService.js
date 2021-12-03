const {Items} = require('../models');

const createItem = async(item) => {
    try {
        const createdItem = await Items.create(item);
        if(!createdItem) return {error: {message: "Something went wrong, try again", code: 500}};
        return {createdItem: createdItem.toJSON()};
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};
const updateItem = async(item, id) => {
    try {
        const updatedItem = await Items.update( item, {where: { itemId: id}, raw: true});
        if(!updatedItem) return {error: {message: "Something went wrong, try again", code: 500}};
        return {updatedItem: updatedItem};
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};

const getItems = async()=>{
    try{
        let items = await Items.findAll();
        
         return  {items};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const getItemById = async(id)=>{
    try{
        let item = await Items.findOne({where:{itemId:id}});
         return  {Item:item.toJSON()};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const getItemByShipmentId = async(id)=>{
    try{
        let items = await Items.findAll({where:{shipmentId:id}, raw:true});
         return  {items};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};


module.exports = {
    createItem,
    updateItem, 
    getItems,
    getItemById,
    getItemByShipmentId
}