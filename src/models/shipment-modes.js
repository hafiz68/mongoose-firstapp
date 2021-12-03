const mongoose = require('mongoose');




const ModesSchema = new mongoose.Schema({
  modeName: {type: String, required: true },
  rate: {type: Number, required: true }
}, {timestamps: true});

const ShipmentModes = mongoose.model("ShipmentModes", ModesSchema);



// const ShipmentModes = db.define("ShipmentModes", {
//   id: {
//     type: mongoose.UUID,
//     defaultValue: mongoose.UUIDV1,
//     primaryKey: true
// },
//     modeName: {
//         type: mongoose.ENUM('By air', 'BY road', 'By train'),
//         allowNull: false,
//       },
//     rate: {
//         type: mongoose.FLOAT,
//         allowNull: false
//       }
//   });

  module.exports= ShipmentModes;

  