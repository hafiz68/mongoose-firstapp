const mongoose = require('mongoose');


const ItemSchema = new mongoose.Schema({
  itemType: {type: String, required: true, enum: ['Solid', 'Fragile', 'Paper', 'Liquid']},
  itemName: {type: String, required: true },
  weight: {type: Number, required: true },
  shipmentId:{type: mongoose.Types.ObjectId, ref: 'Shipments'}

}, {timestamps: true});

const Items = mongoose.model("Itmes", ItemSchema);


// const Items = db.define("Items", {
//     id: {
//         type: mongoose.STRING,
//         defaultValue: mongoose.UUIDV,
//         primaryKey: true
//     },
//     itemType: {
//         type: mongoose.ENUM('Solid', 'Fragile', 'Paper', 'Liquid'),
//         allowNull: false,
//       },
//     itemName: {
//         type: mongoose.STRING(500),
//         allowNull: false
//       },
//     weight: {
//       type: mongoose.FLOAT,
//       allowNull: false
//     },
      
//   });

  module.exports= Items;

  