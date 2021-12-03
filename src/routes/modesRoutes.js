const express = require ("express");
const router = express.Router();
const modeControllers = require('../Controllers/modeControllers');


router.post("/createMode" , modeControllers.createMode);
router.put("/updateMode/:id" , modeControllers.updateMode);
router.get("/modes" , modeControllers.getModes);
router.get("/mode/:id" , modeControllers.getModeById);






module.exports = router;