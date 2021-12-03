const userService = require("../services/userService");
const authService = require("./../services/authService");
const mailService = require('./../services/mailService');
const Validation = require('./../validations/userValidations');

const { v4 } = require("uuid");
const uuid = v4;
const bcrypt = require("bcrypt");
require('dotenv').config();


const signup = async (req, res) => {
  const { userName,firstName,lastName, userEmail, userPassword, role } = req.body;
  console.log(req.body);
  try {
    
    const resp = await userService.getUserByEmail(userEmail);
    if (resp.user) return res.status(400).send("User already exist");
    if (resp.error) return res.status(resp.error.code).send(resp.error.message);
    if (resp.user && resp.user.active == false)
      return res
        .status(400)
        .send(
          "you deleted your account against this email do you want to recover"
        );
        
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    const newUser = {
      id: uuid(),
      userName,
      firstName,
      lastName,
      userEmail,
      userPassword: hashedPassword,
      role,
    };
    
    const resp4 = await authService.emailVerifyToken(newUser.userEmail);
    if(!resp4.token) return res.status(resp4.token.code).send(resp4.error.message);
    const verifyLink = `http://192.168.0.171:5000/deliveryapp/verifyEmail/${resp4.token}`
    
    const resp2 = await userService.createUser(newUser);
    
    if (resp2.error)return res.status(resp2.error.code).send(resp2.error.message);
    console.log(resp2.createdUser.toJSON())
    const resp3 = await mailService.sendingmail(userEmail, `Please click thae link to verify your email ${verifyLink} `);
    if (resp3?.error) return res.status(resp3.error.code).send(resp3.error.message);
    res.status(200).send({ createdUser: resp2.createdUser});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong, try again" });
  }
  
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const resp = await authService.toknVerification(token);
    if (resp.error) return res.status(resp.error.code).send(resp.error.message);
    console.log(resp.decoder);
    const resp2 = await userService.getUserByEmail(resp.decoder.email);
    if (resp2.error) return res.status(resp2.error.code).send(resp2.error.message);
    console.log(resp2.user)
    if(resp2.user.deleteAt !== null){
    let deletedDate = resp2.user.updatedAt;
    deletedDate.setDate(deletedDate.getDate() + 1);
    console.log(deletedDate);
    console.log(new Date());
    if (new Date() > deletedDate) {
      destroyuser = await userService.destroyUser(resp2.user.id);
      // console.log({dest:destroyuser})
      return res.status(403).send({ message: "Please sign up again" });
    }
  }
    const resp4 = await userService.verifyEmailUpdate(resp2.user.id);
    if (resp4.error) return res.status(resp4.error.code).send(resp4.error.message);
    return res.redirect('http://localhost:3000/login' );
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again");
  }
};



const signInUser = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  try {
    const resp = await userService.getUserByEmail(userEmail);
    if(!resp.user)return res.status(400).send("User not found")
    if(resp.user.verify == false)return res.status(400).send("User not found")
    if (resp.error) return res.status(resp.error.code).send(resp.error.message);
    console.log(resp.user);
    if(resp.user.deleteat != null && !resp.user.active){
    let deletedDate = resp.user.deleteat;
    console.log(deletedDate);
    deletedDate.setDate(deletedDate.getDate() + 30);
    console.log(deletedDate);
    console.log(new Date());
    if (new Date() > deletedDate) {
      destroyuser = await userService.destroyUser(resp.user.id);
      // console.log({dest:destroyuser})
      return res.status(400).send({ message: "No User found" });
    }}
    const resp2 = await authService.passwordVerification(
      userPassword,
      resp.user.userPassword
    );
    if (resp2.error)
      return res.status(resp2.error.code).send(resp2.error.message);

    const resp3 = await authService.tokengenerator(
      resp.user.id,
      resp.user.userEmail,
      resp.user.role
    );
    
    if (resp3.error) return res.status(resp3.error.code).send(resp3.error.message);

    if(!resp.user.active ){
      console.log('Here...');
    const resp4 = await userService.loginUpdate(resp.user.id);

    if (resp4.error) return res.status(resp4.error.code).send(resp4.error.message);}
    const resp5 = await userService.getUserById(resp.user.id);
    if (resp5.error)
      return res.status(resp5.error.code).send(resp5.error.message);
      delete resp5.user.userPassword;
    return res.status(200).send({ signInUser: resp5.user, token: resp3.token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again");
  }
};

const updateUser = async (req, res) => {
  let { id } = req.params;
  const { phoneNo, birthDate, address } = req.body;
  const { token } = req.headers;
  try {
    const resp = await authService.toknVerification(token);
    if (resp.error) return res.status(resp.error.code).send(resp.error.message);
    console.log(resp.decoder);
    if (id !== resp.decoder.id) return res.status(403).send("unautorized user");

    const resp2 = await userService.getUserById(id);
    if (resp2.error)
      return res.status(resp2.error.code).send(resp2.error.message);

    resp2.user.phoneNo = phoneNo;
    resp2.user.birthDate = birthDate;
    resp2.user.address = address;

    const resp4 = await userService.updateUser(resp2.user, id);
    if (resp4.error)
      return res.status(resp4.error.code).send(resp4.error.message);
    if (resp4.updatedUser.length < 1)
      res.status(500).send({ message: "Could not update user" });

    return res.status(200).json( resp2.user );
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again");
  }
};
const updatePass = async (req, res) => {
  let { id } = req.params;
  const { userPassword, newPassword } = req.body;
  const { token } = req.headers;
  try {
    const resp = await authService.toknVerification(token);
    if (resp.error) return res.status(resp.error.code).send(resp.error.message);
    if (id !== resp.decoder.id) return res.status(403).send("unautorized user");
    let resp2 = await userService.getUserById(id);
    if (resp2.error)
      return res.status(resp2.error.code).send(resp2.error.message);
    const resp3 = await authService.passwordVerification(
      userPassword,
      resp2.user.userPassword
    );
    if (resp3.error)
      return res.status(resp3.error.code).send(resp3.error.message);
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    resp2.user.userPassword = hashedPassword;
    const resp4 = await userService.updateUser(resp2.user, id);
    if (resp4.error)
      return res.status(resp4.error.code).send(resp4.error.message);
    return res.status(200).send({ updatedUser: "password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again");
  }
};
const forgetPass = async (req, res) => {
  const { email } = req.body;
  try {
    const resp = await userService.getUserByEmail(email);
    if (resp.user.active == false)
      return res
        .status(400)
        .send(
          "you deleted your account against this email do you want to recover"
        );
    if (resp.error) return res.status(resp.error.code).send(resp.error.message);
    if (!resp.user) return res.status(400).send("Incorrect email");
    let randomCode = Math.floor(10000000 + Math.random() * 90000000);
    console.log(randomCode);
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(randomCode.toString(), salt);
    resp.user.userPassword = hashedPassword;
    console.log(hashedPassword);
    const resp4 = await userService.updateUser(
      resp.user.toJSON(),
      resp.user.id
    );
    if (resp4.error)
      return res.status(resp4.error.code).send(resp4.error.message);
    const resp3 = await mailService.sendingmail(email, randomCode.toString());
    if (resp3?.error) return res.status(resp3.error.code).send(resp3.error.message);
    return res.status(200).send("check your email for new");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again");
  }
};
const allCustomers = async (req, res) => {
  try {
    const resp = await userService.getUsers();
    if (resp.error) return res.status(resp.error.code).send(resp.error.message);
    if (!resp.users) return res.status(400).send("No user found");

    resp.users = resp.users.map((user) => {
      user = user.toJSON();
      delete user.userPassword;
      return user;
    });
    return res.status(200).send(resp.users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again");
  }
};
const getById = async (req, res) => {
  let id = req.params.id;
  id = Number(id);
  try {
    const resp = await userService.getUserById(id);
    if (!resp.user) return res.status(400).send("No user found");

    delete resp.user.userPassword;
    return res.status(200).send(resp.user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again");
  }
};

const deleteUser = async (req, res) => {
  let id = req.params.id;
  const { token } = req.headers;
  const { userEmail, userPassword } = req.body;
  try {
    const resp = await authService.toknVerification(token);
    if (resp.error) return res.status(resp.error.code).send(resp.error.message);
    console.log(resp.decoder);
    if (id !== resp.decoder.id) return res.status(403).send("unautorized user");

    const resp2 = await userService.getUserById(id);
    if (resp2.error)return res.status(resp2.error.code).send(resp2.error.message);
    if (!resp2.user || userEmail !== resp2.user.userEmail)
      return res.status(403).send("unautorized user");
    const resp3 = await authService.passwordVerification(
      userPassword,
      resp2.user.userPassword
    );
    if (resp3.error)
      return res.status(resp3.error.code).send(resp3.error.message);
    const resp4 = await userService.deleteUser(resp.decoder.id);
    if (resp4.error)
      return res.status(resp4.error.code).send(resp4.error.message);
    return res.status(200).send(resp4.Message);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = {
  signup,
  signInUser,
  updateUser,
  updatePass,
  forgetPass,
  allCustomers,
  getById,
  deleteUser,
  verifyEmail
};
