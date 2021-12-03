const {ShipmentModes} = require('../models');

const getModeByName = async(modeName)=>{
        try{
            let mode = await ShipmentModes.findOne({where:{modeName}});
             return  {mode:mode.toJSON()};
        } catch(error){
            console.log(error);
            return {error: {message: "Something went wrong, try again", code: 500}};
        }
        
    };
    

    module.exports = {
        getModeByName
    }