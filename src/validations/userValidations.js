const Joi = require('joi');


    
const createUserSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    userName: Joi.string().required(),
    userEmail: Joi.string().email(),
    userPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
    role: Joi.string().required('Customer', 'Admin', 'Employee'),
    phoneNo:Joi.number(),
    birthDate:Joi.date(),
    address:Joi.string()  
});






module.exports ={
    createUserSchema
}