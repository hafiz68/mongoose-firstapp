// // db connection
// const Users = require('./users');
// const Items = require('./items');
// const Shipments = require('./shipments');
// const ShipmentModes = require('./shipment-modes');

// Users.hasMany(Shipments, {
//     foreignKey: 'userId'
//   });

//   Shipments.hasMany(Items, {
//     foreignKey: 'shipmentId'
//   });
//   ShipmentModes.hasMany(Shipments, {
//     foreignKey: 'modeId'
//   });

//   module.exports =  {
//       Users,
//       Items,
//       ShipmentModes,
//       Shipments
//   };