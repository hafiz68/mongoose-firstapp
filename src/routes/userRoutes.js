const express =  require("express");

const userController = require('../Controllers/userControllers');


const router = express.Router();
router.post("/signup",  userController.signup);
router.post("/signin" , userController.signInUser);
router.put("/updateUser/:id" , userController.updateUser);
router.put("/updatePass/:id" , userController.updatePass);
router.put("/forgetPass" , userController.forgetPass);
router.get("/allUsers" , userController.allCustomers);
router.get("/userById/:id" , userController.getById);
router.delete("/deleteUser/:id" , userController.deleteUser);
router.get("/verifyEmail/:token" , userController.verifyEmail);




module.exports = router;