const mongoose = require('mongoose');
const Users = require('../models/users');

const createUser = async(user) => {
    try {
        const createdUser = await Users.create(user);
        if(!createdUser) return {error: {message: "Something went wrong, try again", code: 500}};
        return {createdUser: createdUser};
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};
const updateUser = async(user, id) => {
    try {
        const updatedUser = await Users.findOneAndUpdate( user, {where: { id}});
        if(!updatedUser) return {error: {message: "Something went wrong, try again", code: 500}};
        console.log(updatedUser);
        return {updatedUser: updatedUser};
    } catch (error) {
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
};

const getUserByEmail = async(email)=>{
    try{
        let user = await Users.findOne({userEmail:email});
         return  {user:user};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const getUsers = async()=>{
    try{
        let users = await Users.find({active:true});
        
         return  {users};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const getUserById = async(id)=>{
    try{
        let user = await Users.findById(id );
         return  {user:user};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const deleteUser = async(id)=>{
    try{
        let user = await Users.findByIdAndUpdate(id,{active: false , deleteat: new Date()});
         return  {Message:"User deleted successfully"};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const loginUpdate = async(id)=>{
    let active = false;
    // return { message: "True" }
    try{
        console.log("yes")
        // let user = await Users.update({active: true},{where:{id:id}});
        let user = await Users.findByIdAndUpdate( id ,{active: true   } )
        console.log(user)
         return  {user};
    } catch(error){
        console.log(error);
        return {error: {message: error.message, code: 500}};
    }
    
};
const destroyUser = async(id)=>{
    try{
        let user = await Users.findByIdAndDelete(id);
         return  {Message:"User deleted successfully"};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};
const verifyEmailUpdate = async(id)=>{
    console.log(id);
    try{
        let user = await Users.findByIdAndUpdate(id, {verifiy: true});
        console.log(user)
         return  {user};
    } catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
    
};

module.exports = {
    createUser,
    getUserByEmail,
    updateUser, 
    getUsers,
    getUserById,
    deleteUser,
    destroyUser,
    loginUpdate,
    verifyEmailUpdate
}