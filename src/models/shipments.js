const mongoose = require('mongoose');

const ShipmentsSchema = new mongoose.Schema({
  ShipmentCode: {type: String, required: true },
  active: {type: Boolean, required: true, default: true },
  destination:{type: String, required: true},
  receivingDate:{type: Date, required: true},
  charges:{type: Number},
  bookingDate:{type: Date, required: true},
  shipMethod:{ type: String, required: true, enum:['By air', 'BY road', 'By train']  },
  userId:{type: mongoose.Types.ObjectId, ref: 'Users'},
  modeId:{type: mongoose.Types.ObjectId, ref: 'ShipmentModes'}
}, {timestamps: true});

const Shipments = mongoose.model("Shipments", ShipmentsSchema);
// const Shipments = db.define("Shipments", {
//     id: {
//         type: mongoose.UUID,
//         defaultValue: mongoose.UUIDV1,
//         primaryKey: true
//     },
//     ShipmentCode: {
//         type: mongoose.STRING(50),
//         allowNull: false,
//       },
//       active: {
//         type: mongoose.BOOLEAN,
//         defaultValue: true
//       },
//     destination: {
//         type: mongoose.STRING(500),
//         allowNull: false
//       },
//     receivingDate: {
//       type: mongoose.DATE,
//       allowNull: false
//     },
//     charges: {
//         type: mongoose.FLOAT,
//         allowNull: true
//     },
//     bookingDate:{
//         type: mongoose.DATE,
//         allowNull: false
//     },
//     shipMethod:{
//         type: mongoose.ENUM('By air', 'BY road', 'By train'),
//         allowNull: false
//     }
//   });

  module.exports= Shipments;

  