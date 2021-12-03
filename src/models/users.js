
const mongoose = require('mongoose');


const UsersSchema = new mongoose.Schema({
  userEmail: {type: String, required: true },
  firstName: {type: String, required: true },
  lastName: {type: String, required: true },
  userName: {type: String, required: true },
  role:{ type: String, required: true, enum:['Admin', 'Customer', 'Employee']  },
  active: {type: Boolean, required: true, default: true },
  verifiy: {type: Boolean, required: true, default: false },
  address:{type: String},
  birthDate:{type: Date},
  deleteAt:{type: Date, default: null},
  phoneNo:{type: Number},
  
},{multi:true}, {upsert: true});

const Users = mongoose.model("Users", UsersSchema);
// const Users = db.define("Users", {
//   id: {
//     type: mongoose.UUID,
//     defaultValue: mongoose.UUIDV1,
//     primaryKey: true
// },
//     userEmail: {
//         type: mongoose.STRING(50),
//         allowNull: false,
//       },
//     userPassword: {
//         type: mongoose.STRING(500),
//         allowNull: false
//       },
//     userName: {
//       type: mongoose.STRING(50),
//       allowNull: false
//     },
//       role: {
//       type: mongoose.ENUM('Customer', 'Admin', 'Employee'),
//       allowNull: false
//     },
//     phoneNo: {
//         type: mongoose.STRING(20),
//         allowNull: true
//     },
//     birthDate:{
//         type: mongoose.DATE,
//         allowNull: true
//     },
//     active: {
//       type: mongoose.BOOLEAN,
//       defaultValue: true
//     },
//     deleteat: {
//       type: mongoose.DATE,
//       defaultValue: null
//     },
//     verify: {
//       type: mongoose.BOOLEAN,
//       defaultValue: false
//     },
//     address:{
//         type: mongoose.STRING,
//         allowNull: true
//     }
//   });

  module.exports= Users;

  