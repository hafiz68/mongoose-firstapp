const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const passwordVerification = async(password, userPassword) =>{
    try{
        const validPassword = await bcrypt.compare(password, userPassword  );
        
        if(!validPassword) return {error: {message: "invalid password", code: 401}};
        
        return {validPassword: validPassword};


    }catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
}

const emailVerifyToken = async(email) =>{
    try{
        const token=jwt.sign({email}, process.env.JWT_SECRET_KEY,{ expiresIn: '3600s'} );
        console.log(token);
        if(!token) return {error: {message: "unauthorised", code: 403}};
        return {token}
    }catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
} 


const tokengenerator = async(id , email, role) =>{
    try{
        const token=jwt.sign({id, email, role}, process.env.JWT_SECRET_KEY,{ expiresIn: '86400s'} );
        console.log(token);
        if(!token) return {error: {message: "unauthorised", code: 403}};
        return {token}
    }catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
} 


const toknVerification = async(token)=>{
    try{
        const decoder = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decoder) return {error: {message: "unauthorised", code: 403}};
        return {decoder}
    }catch(error){
        console.log(error);
        return {error: {message: "Something went wrong, try again", code: 500}};
    }
}



module.exports ={
    passwordVerification,
    tokengenerator,
    toknVerification,
    emailVerifyToken
}